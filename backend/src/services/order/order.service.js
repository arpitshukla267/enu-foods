import mongoose from "mongoose";
import Order from "./order.model.js";
import Payment from "../payment/payment.model.js";
import Product from "../product/product.model.js";
import User from "../user/user.model.js";
import Cart from "../cart/cart.model.js";
import { fromPaise, toPaise } from "../../lib/money.js";
import { normalizeWeight, validateObjectId } from "../cart/cart.validation.js";
import { recordCouponUsage } from "../coupon/coupon.service.js";
import { getStoreSettings } from "../settings/setting.service.js";
import {
  createRazorpayOrder,
  getRazorpayKeyId,
  isRazorpayConfigured,
} from "../payment/gateways/razorpayGateway.js";
import {
  parsePositiveInt,
  validateCreateOrderPayload,
  validateListOrdersQuery,
  validateUpdateOrderStatusPayload,
} from "./order.validation.js";

const SHIPPING_EXPRESS_PAISE = 4900;

const findVariant = (product, weight) => {
  const normalizedWeight = normalizeWeight(weight);
  return (product.weightVariants || []).find(
    (variant) => normalizeWeight(variant.weight) === normalizedWeight,
  );
};

const generateOrderNumber = async (session) => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const orderNumber = `ENU-${Math.floor(100000 + Math.random() * 900000)}`;
    const exists = await Order.exists({ orderNumber }).session(session);
    if (!exists) {
      return orderNumber;
    }
  }

  const error = new Error("Unable to generate order number");
  error.statusCode = 500;
  throw error;
};

const appendStatusHistory = (order, status, paymentStatus, note = "") => {
  order.statusHistory.push({
    status,
    paymentStatus,
    note,
    changedAt: new Date(),
  });
};

const formatOrderItemPublic = (item) => ({
  productId: item.productId.toString(),
  productName: item.productName,
  productSlug: item.productSlug,
  image: item.image,
  sku: item.sku,
  weight: item.weight,
  quantity: item.quantity,
  unitPrice: fromPaise(item.unitPricePaise),
  price: fromPaise(item.unitPricePaise),
  subtotal: fromPaise(item.subtotalPaise),
});

const formatOrderStatusHistoryPublic = (order) => {
  const history = (order.statusHistory || []).map((entry) => ({
    status: entry.status,
    paymentStatus: entry.paymentStatus,
    note: entry.note || "",
    timestamp: entry.changedAt,
  }));

  if (history.length) {
    return history;
  }

  return [
    {
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      note: "Order placed",
      timestamp: order.createdAt,
    },
  ];
};

export const formatOrderForCustomer = (order) => ({
  id: order._id.toString(),
  orderNumber: order.orderNumber,
  items: order.items.map(formatOrderItemPublic),
  shippingAddress: order.shippingAddress,
  shippingMethod: order.shippingMethod,
  paymentMethod: order.paymentMethod,
  subtotal: fromPaise(order.subtotalPaise),
  discount: fromPaise(order.discountPaise),
  shippingFee: fromPaise(order.shippingPaise),
  total: fromPaise(order.totalPaise),
  coupon: order.coupon?.code
    ? {
        code: order.coupon.code,
        discount: fromPaise(order.coupon.discountPaise),
      }
    : null,
  orderStatus: order.orderStatus,
  paymentStatus: order.paymentStatus,
  trackingNumber: order.trackingNumber || "",
  carrier: order.carrier || "",
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  statusHistory: formatOrderStatusHistoryPublic(order),
});

export const formatOrderForAdmin = (order, user) => ({
  id: order._id.toString(),
  orderNumber: order.orderNumber,
  customer: user
    ? {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: {
          street: order.shippingAddress.addressLine,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode,
          country: "India",
        },
      }
    : null,
  items: order.items.map(formatOrderItemPublic),
  subtotal: fromPaise(order.subtotalPaise),
  discount: fromPaise(order.discountPaise),
  shippingFee: fromPaise(order.shippingPaise),
  tax: order.taxPaise ? fromPaise(order.taxPaise) : Math.round((fromPaise(order.subtotalPaise) * 0.05) * 100) / 100,
  total: fromPaise(order.totalPaise),
  paymentStatus: mapPaymentStatusForAdmin(order.paymentStatus),
  paymentMethod: mapPaymentMethodForAdmin(order.paymentMethod),
  orderStatus: mapOrderStatusForAdmin(order.orderStatus),
  shippingMethod: order.shippingMethod || "free",
  trackingNumber: order.trackingNumber || "",
  carrier: order.carrier || "",
  notes: order.notes || "",
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  statusHistory: (order.statusHistory || []).map((entry) => ({
    status: mapOrderStatusForAdmin(entry.status),
    timestamp: entry.changedAt,
    note: entry.note || "",
  })),
});

const mapOrderStatusForAdmin = (status) => {
  if (status === "pending_payment") return "pending";
  return status;
};

const mapPaymentStatusForAdmin = (status) => {
  if (status === "paid") return "paid";
  if (status === "failed") return "failed";
  if (status === "refunded") return "refunded";
  return "pending";
};

const mapPaymentMethodForAdmin = (method) => {
  switch (method) {
    case "upi":
      return "UPI";
    case "card":
      return "Credit Card";
    case "netbanking":
      return "Net Banking";
    case "cod":
      return "Cash on Delivery";
    default:
      return "UPI";
  }
};

const buildShippingPaise = async (shippingMethod, subtotalPaise = 0) => {
  const storeSettings = await getStoreSettings();
  const expressFeePaise = toPaise(storeSettings?.expressShippingFee ?? 49);
  const standardFeePaise = toPaise(storeSettings?.standardShippingFee ?? 60);
  const freeThresholdPaise = toPaise(storeSettings?.freeShippingThreshold ?? 999);

  if (shippingMethod === "express") {
    return expressFeePaise;
  }
  return subtotalPaise >= freeThresholdPaise ? 0 : standardFeePaise;
};

export const prepareCartCheckout = async (userId) => {
  const { getCartForUser } = await import("../cart/cart.service.js");
  const cartSummary = await getCartForUser(userId);

  if (!cartSummary.items?.length) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const unavailable = cartSummary.items.filter((item) => !item.isAvailable);
  if (unavailable.length) {
    const error = new Error(
      unavailable.map((item) => item.statusMessage || item.name).join(". "),
    );
    error.statusCode = 400;
    throw error;
  }

  return cartSummary;
};

const decrementVariantStock = async ({ productId, weight, quantity, session }) => {
  const product = await Product.findById(productId).session(session);
  if (!product || !product.isActive || product.status !== "active") {
    const error = new Error("Product is no longer available");
    error.statusCode = 400;
    throw error;
  }

  const variant = findVariant(product, weight);
  if (!variant) {
    const error = new Error("Selected pack size is no longer available");
    error.statusCode = 400;
    throw error;
  }

  const updated = await Product.findOneAndUpdate(
    {
      _id: productId,
      isActive: true,
      status: "active",
      weightVariants: {
        $elemMatch: {
          weight: variant.weight,
          stock: { $gte: quantity },
        },
      },
    },
    { $inc: { "weightVariants.$.stock": -quantity } },
    { session, new: true },
  );

  if (!updated) {
    const error = new Error(`Insufficient stock for ${product.name} (${variant.weight})`);
    error.statusCode = 400;
    throw error;
  }

  const totalStock = updated.weightVariants.reduce(
    (sum, entry) => sum + Number(entry.stock || 0),
    0,
  );
  await Product.updateOne({ _id: productId }, { $set: { stock: totalStock } }, { session });

  const liveVariant = findVariant(updated, weight);
  return {
    sku: liveVariant?.sku || variant.sku,
    unitPricePaise: toPaise(liveVariant?.price ?? variant.price),
  };
};

const restoreVariantStock = async ({ productId, weight, quantity, session }) => {
  const product = await Product.findById(productId).session(session);
  if (!product) return;

  const variant = findVariant(product, weight);
  if (!variant) return;

  variant.stock = Number(variant.stock) + quantity;
  product.stock = product.weightVariants.reduce(
    (sum, entry) => sum + Number(entry.stock || 0),
    0,
  );
  await product.save({ session });
};

const buildOrderItemsFromCart = async (cartItems, session) => {
  const orderItems = [];

  for (const item of cartItems) {
    const live = await decrementVariantStock({
      productId: item.productId,
      weight: item.weight,
      quantity: item.quantity,
      session,
    });

    orderItems.push({
      productId: item.productId,
      productName: item.name,
      productSlug: item.slug,
      image: item.image,
      sku: live.sku,
      weight: item.weight,
      quantity: item.quantity,
      unitPricePaise: live.unitPricePaise,
      subtotalPaise: live.unitPricePaise * item.quantity,
    });
  }

  return orderItems;
};

const finalizeOnlinePayment = async (order, payment) => {
  const orderId = order._id ?? order.id;
  const paymentId = payment._id ?? payment.id;

  const current = await Payment.findById(paymentId);
  if (!current) {
    const error = new Error("Payment record not found");
    error.statusCode = 404;
    throw error;
  }

  if (current.providerOrderId) {
    return current;
  }

  let razorpayOrder;
  try {
    razorpayOrder = await createRazorpayOrder({
      amountPaise: order.totalPaise ?? current.amountPaise,
      receipt: order.orderNumber,
      notes: {
        orderId: orderId.toString(),
        userId: (order.user?.toString?.() ?? order.user).toString(),
      },
    });
  } catch (error) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await markOrderPaymentFailed({
          orderId,
          reason: error.message || "Failed to initiate online payment",
          session,
        });
      });
    } finally {
      session.endSession();
    }
    throw error;
  }

  const updated = await Payment.findOneAndUpdate(
    {
      _id: current._id,
      provider: "razorpay",
      $or: [{ providerOrderId: { $exists: false } }, { providerOrderId: null }],
    },
    {
      $set: {
        providerOrderId: razorpayOrder.providerOrderId,
        metadata: {
          ...(current.metadata || {}),
          razorpayReceipt: order.orderNumber,
        },
      },
    },
    { new: true },
  );

  if (updated) {
    return updated;
  }

  const refreshed = await Payment.findById(current._id);
  if (refreshed?.providerOrderId) {
    return refreshed;
  }

  const error = new Error("Unable to finalize online payment");
  error.statusCode = 500;
  throw error;
};

export const createOrderFromCart = async (userId, payload) => {
  const parsed = validateCreateOrderPayload(payload);

  if (parsed.idempotencyKey) {
    const existing = await Order.findOne({
      user: userId,
      idempotencyKey: parsed.idempotencyKey,
    }).lean();

    if (existing) {
      const payment = await Payment.findOne({ order: existing._id });
      if (
        payment?.provider === "razorpay" &&
        !payment.providerOrderId &&
        existing.orderStatus === "pending_payment"
      ) {
        const finalizedPayment = await finalizeOnlinePayment(existing, payment);
        return buildCreateOrderResponse(existing, finalizedPayment);
      }
      return buildCreateOrderResponse(existing, payment?.toObject?.() ?? payment);
    }
  }

  const cartSummary = await prepareCartCheckout(userId);

  const storeSettings = await getStoreSettings();
  const taxRate = (storeSettings?.taxRatePercent ?? 5) / 100;

  const shippingPaise = await buildShippingPaise(parsed.shippingMethod, cartSummary.subtotalPaise);
  const subtotalPaise = cartSummary.subtotalPaise;
  const discountPaise = cartSummary.discountPaise || 0;
  const taxablePaise = Math.max(0, subtotalPaise - discountPaise);
  const taxPaise = Math.round(taxablePaise * taxRate);
  const totalPaise = Math.max(0, taxablePaise + shippingPaise);
  const isCod = parsed.paymentMethod === "cod";

  if (!isCod && !isRazorpayConfigured()) {
    const error = new Error("Online payments are temporarily unavailable");
    error.statusCode = 503;
    throw error;
  }

  const session = await mongoose.startSession();
  let createdOrder;
  let createdPayment;

  try {
    await session.withTransaction(async () => {
      const orderItems = await buildOrderItemsFromCart(cartSummary.items, session);
      const orderNumber = await generateOrderNumber(session);

      const orderStatus = isCod ? "confirmed" : "pending_payment";
      const paymentStatus = isCod ? "pending" : "pending";

      const order = await Order.create(
        [
          {
            orderNumber,
            user: userId,
            items: orderItems,
            shippingAddress: parsed.shippingAddress,
            shippingMethod: parsed.shippingMethod,
            paymentMethod: parsed.paymentMethod,
            subtotalPaise,
            discountPaise,
            shippingPaise,
            taxPaise,
            totalPaise,
            coupon: cartSummary.coupon?.code
              ? {
                  code: cartSummary.coupon.code,
                  discountPaise,
                }
              : null,
            orderStatus,
            paymentStatus,
            idempotencyKey: parsed.idempotencyKey || undefined,
            stockReserved: true,
            statusHistory: [],
          },
        ],
        { session },
      );

      createdOrder = order[0];
      appendStatusHistory(
        createdOrder,
        orderStatus,
        paymentStatus,
        isCod ? "Order placed with Cash on Delivery" : "Awaiting online payment",
      );
      await createdOrder.save({ session });

      if (isCod) {
        const payment = await Payment.create(
          [
            {
              order: createdOrder._id,
              user: userId,
              amountPaise: totalPaise,
              provider: "cod",
              status: "pending",
              idempotencyKey: parsed.idempotencyKey
                ? `cod-${parsed.idempotencyKey}`
                : `cod-${createdOrder._id}`,
            },
          ],
          { session },
        );
        createdPayment = payment[0];
      } else {
        const payment = await Payment.create(
          [
            {
              order: createdOrder._id,
              user: userId,
              amountPaise: totalPaise,
              provider: "razorpay",
              status: "created",
              idempotencyKey: parsed.idempotencyKey
                ? `rzp-${parsed.idempotencyKey}`
                : `rzp-${createdOrder._id}`,
              metadata: { razorpayReceipt: createdOrder.orderNumber },
            },
          ],
          { session },
        );
        createdPayment = payment[0];
      }

      if (cartSummary.coupon?.code) {
        const couponDoc = await import("../coupon/coupon.model.js").then((m) =>
          m.default.findOne({ code: cartSummary.coupon.code }).session(session),
        );
        if (couponDoc) {
          await recordCouponUsage(couponDoc._id, userId, 1, session);
        }
      }

      await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [], appliedCouponCode: "" } },
        { session },
      );
    });
  } catch (error) {
    if (error.code === 11000 && parsed.idempotencyKey) {
      const existing = await Order.findOne({
        user: userId,
        idempotencyKey: parsed.idempotencyKey,
      }).lean();
      if (existing) {
        const payment = await Payment.findOne({ order: existing._id }).lean();
        return buildCreateOrderResponse(existing, payment);
      }
    }
    throw error;
  } finally {
    session.endSession();
  }

  if (!isCod && createdOrder && createdPayment) {
    createdPayment = await finalizeOnlinePayment(createdOrder, createdPayment);
  }

  return buildCreateOrderResponse(createdOrder, createdPayment);
};

const buildCreateOrderResponse = (order, payment) => {
  const formatted = formatOrderForCustomer(order);
  const response = {
    order: formatted,
    payment: payment
      ? {
          id: payment._id.toString(),
          provider: payment.provider,
          status: payment.status,
          amount: fromPaise(payment.amountPaise),
          amountPaise: payment.amountPaise,
        }
      : null,
  };

  if (payment?.provider === "razorpay") {
    response.razorpay = {
      keyId: getRazorpayKeyId(),
      orderId: payment.providerOrderId,
      amount: payment.amountPaise,
      currency: "INR",
      orderNumber: order.orderNumber,
    };
  }

  return response;
};

export const listOrdersForUser = async (userId, query = {}) => {
  const { page, limit } = validateListOrdersQuery(query);
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ user: userId }),
  ]);

  return {
    orders: orders.map(formatOrderForCustomer),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getOrderForUser = async (userId, orderId) => {
  validateObjectId(orderId, "order id");
  const order = await Order.findOne({ _id: orderId, user: userId }).lean();
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  return formatOrderForCustomer(order);
};

export const listAdminOrders = async (query = {}) => {
  const { page, limit, search, orderStatus, paymentStatus, sort, userId } =
    validateListOrdersQuery(query, { admin: true });
  const skip = (page - 1) * limit;
  const filter = {};

  if (userId) {
    filter.user = userId;
  }

  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
    ];
  }

  if (orderStatus && orderStatus !== "all") {
    filter.orderStatus =
      orderStatus === "pending" ? "pending_payment" : orderStatus;
  }

  if (paymentStatus && paymentStatus !== "all") {
    filter.paymentStatus = paymentStatus;
  }

  const sortOption =
    sort === "amount-high"
      ? { totalPaise: -1 }
      : sort === "amount-low"
        ? { totalPaise: 1 }
        : sort === "oldest"
          ? { createdAt: 1 }
          : { createdAt: -1 };

  const [orders, total] = await Promise.all([
    Order.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  const userIds = [...new Set(orders.map((order) => order.user.toString()))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("name email phone")
    .lean();
  const userMap = Object.fromEntries(users.map((user) => [user._id.toString(), user]));

  return {
    orders: orders.map((order) =>
      formatOrderForAdmin(order, userMap[order.user.toString()]),
    ),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getAdminOrderById = async (orderId) => {
  validateObjectId(orderId, "order id");
  const order = await Order.findById(orderId).lean();
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  const user = await User.findById(order.user).select("name email phone").lean();
  return formatOrderForAdmin(order, user);
};

export const updateAdminOrderStatus = async (orderId, payload) => {
  validateObjectId(orderId, "order id");
  const parsed = validateUpdateOrderStatusPayload(payload);

  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const nextOrderStatus =
    parsed.orderStatus === "pending" ? "pending_payment" : parsed.orderStatus;

  order.orderStatus = nextOrderStatus;
  order.paymentStatus = parsed.paymentStatus;
  if (parsed.trackingNumber !== undefined) {
    order.trackingNumber = parsed.trackingNumber;
  }
  if (parsed.carrier !== undefined) {
    order.carrier = parsed.carrier;
  }
  if (parsed.notes !== undefined) {
    order.notes = parsed.notes;
  }

  appendStatusHistory(
    order,
    nextOrderStatus,
    parsed.paymentStatus,
    parsed.note || "Status updated by admin",
  );

  await order.save();

  const user = await User.findById(order.user).select("name email phone").lean();
  return formatOrderForAdmin(order.toObject(), user);
};

export const markOrderPaymentSuccess = async ({
  orderId,
  providerPaymentId,
  webhookEventId,
  session,
}) => {
  const order = await Order.findById(orderId).session(session);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.paymentStatus === "paid") {
    return { order, alreadyProcessed: true };
  }

  const payment = await Payment.findOne({ order: orderId }).session(session);
  if (!payment) {
    const error = new Error("Payment record not found");
    error.statusCode = 404;
    throw error;
  }

  if (payment.status === "success") {
    return { order, payment, alreadyProcessed: true };
  }

  payment.status = "success";
  payment.providerPaymentId = providerPaymentId || payment.providerPaymentId;
  if (webhookEventId) {
    payment.webhookEventId = webhookEventId;
  }
  await payment.save({ session });

  order.orderStatus = "confirmed";
  order.paymentStatus = "paid";
  appendStatusHistory(order, "confirmed", "paid", "Payment verified successfully");
  await order.save({ session });

  return { order, payment, alreadyProcessed: false };
};

export const markOrderPaymentFailed = async ({ orderId, reason, session }) => {
  const order = await Order.findById(orderId).session(session);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.paymentStatus === "paid") {
    return { order, alreadyProcessed: true };
  }

  const payment = await Payment.findOne({ order: orderId }).session(session);
  if (payment && payment.status !== "success") {
    payment.status = "failed";
    payment.failureReason = reason || "Payment failed";
    await payment.save({ session });
  }

  if (order.stockReserved) {
    for (const item of order.items) {
      await restoreVariantStock({
        productId: item.productId,
        weight: item.weight,
        quantity: item.quantity,
        session,
      });
    }
    order.stockReserved = false;
  }

  order.orderStatus = "payment_failed";
  order.paymentStatus = "failed";
  appendStatusHistory(order, "payment_failed", "failed", reason || "Payment failed");
  await order.save({ session });

  return { order, payment, alreadyProcessed: false };
};

export const restoreOrderStock = restoreVariantStock;
