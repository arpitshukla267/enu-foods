import mongoose from "mongoose";

export const validateObjectId = (value, label = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
};

export const parsePositiveInt = (value, fallback, max) => {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return max ? Math.min(parsed, max) : parsed;
};

const validateShippingAddress = (address = {}) => {
  const errors = [];
  const requiredFields = [
    ["fullName", "fullName"],
    ["phone", "phone"],
    ["pincode", "pincode"],
    ["addressLine", "addressLine"],
    ["city", "city"],
    ["state", "state"],
  ];

  requiredFields.forEach(([key, label]) => {
    if (!String(address[key] || "").trim()) {
      errors.push(`${label} is required`);
    }
  });

  const phoneDigits = String(address.phone || "").replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    errors.push("phone must be at least 10 digits");
  }

  if (errors.length) {
    const error = new Error(errors.join(". "));
    error.statusCode = 400;
    throw error;
  }

  return {
    fullName: String(address.fullName).trim(),
    phone: phoneDigits,
    pincode: String(address.pincode).trim(),
    addressLine: String(address.addressLine).trim(),
    city: String(address.city).trim(),
    state: String(address.state).trim(),
  };
};

export const validateCreateOrderPayload = (payload = {}) => {
  const paymentMethods = ["upi", "card", "netbanking", "cod"];
  const shippingMethods = ["free", "express"];

  if (!paymentMethods.includes(payload.paymentMethod)) {
    const error = new Error("Invalid payment method");
    error.statusCode = 400;
    throw error;
  }

  if (!shippingMethods.includes(payload.shippingMethod || "free")) {
    const error = new Error("Invalid shipping method");
    error.statusCode = 400;
    throw error;
  }

  const shippingAddress = validateShippingAddress(payload.shippingAddress);
  const idempotencyKey = String(payload.idempotencyKey || "").trim().slice(0, 128);

  return {
    shippingAddress,
    shippingMethod: payload.shippingMethod || "free",
    paymentMethod: payload.paymentMethod,
    idempotencyKey,
  };
};

export const validateListOrdersQuery = (query = {}, { admin = false } = {}) => {
  const page = parsePositiveInt(query.page, 1, 100000);
  const limit = parsePositiveInt(query.limit, admin ? 20 : 10, 50);
  const search = String(query.search || "").trim();

  const orderStatuses = [
    "all",
    "pending",
    "pending_payment",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "payment_failed",
  ];
  const paymentStatuses = ["all", "pending", "paid", "failed", "refunded"];
  const sorts = ["newest", "oldest", "amount-high", "amount-low"];

  const orderStatus = String(query.orderStatus || query.status || "all");
  const paymentStatus = String(query.paymentStatus || "all");
  const sort = String(query.sort || "newest");

  if (!orderStatuses.includes(orderStatus)) {
    const error = new Error("Invalid order status filter");
    error.statusCode = 400;
    throw error;
  }

  if (!paymentStatuses.includes(paymentStatus)) {
    const error = new Error("Invalid payment status filter");
    error.statusCode = 400;
    throw error;
  }

  if (!sorts.includes(sort)) {
    const error = new Error("Invalid sort option");
    error.statusCode = 400;
    throw error;
  }

  const userId = query.userId ? String(query.userId).trim() : undefined;

  return { page, limit, search, orderStatus, paymentStatus, sort, userId };
};

export const validateUpdateOrderStatusPayload = (payload = {}) => {
  const orderStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "payment_failed",
  ];
  const paymentStatuses = ["pending", "paid", "failed", "refunded"];

  if (!orderStatuses.includes(payload.orderStatus)) {
    const error = new Error("Invalid order status");
    error.statusCode = 400;
    throw error;
  }

  if (!paymentStatuses.includes(payload.paymentStatus)) {
    const error = new Error("Invalid payment status");
    error.statusCode = 400;
    throw error;
  }

  return {
    orderStatus: payload.orderStatus,
    paymentStatus: payload.paymentStatus,
    trackingNumber:
      payload.trackingNumber !== undefined
        ? String(payload.trackingNumber).trim()
        : undefined,
    carrier:
      payload.carrier !== undefined ? String(payload.carrier).trim() : undefined,
    notes: payload.notes !== undefined ? String(payload.notes).trim() : undefined,
    note: payload.note !== undefined ? String(payload.note).trim() : undefined,
  };
};

export const validateVerifyPaymentPayload = (payload = {}) => {
  const providerOrderId = String(payload.razorpay_order_id || payload.providerOrderId || "").trim();
  const providerPaymentId = String(
    payload.razorpay_payment_id || payload.providerPaymentId || "",
  ).trim();
  const signature = String(payload.razorpay_signature || payload.signature || "").trim();

  if (!providerOrderId || !providerPaymentId || !signature) {
    const error = new Error("Payment verification details are incomplete");
    error.statusCode = 400;
    throw error;
  }

  return { providerOrderId, providerPaymentId, signature };
};
