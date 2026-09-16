import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";

dotenv.config();

const API = "http://localhost:5000/api";
const results = [];

const log = (name, passed, detail = "") => {
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"} - ${name}${detail ? `: ${detail}` : ""}`);
};

const request = async (path, { method = "GET", token, body, headers = {} } = {}) => {
  const requestHeaders = { "Content-Type": "application/json", ...headers };
  if (token) requestHeaders.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
};

const unique = Date.now();

const registerUser = async (roleSuffix) => {
  const payload = {
    name: `Order Tester ${roleSuffix}`,
    email: `order.test.${roleSuffix}.${unique}@example.com`,
    phone: `${String(unique + roleSuffix.length).slice(-10)}`,
    password: "TestPass123!",
  };

  const response = await request("/auth/register", { method: "POST", body: payload });
  if (response.status !== 201) {
    throw new Error(`Register failed: ${response.data.message || response.status}`);
  }

  return {
    token: response.data.data.token,
    user: response.data.data.user,
  };
};

const makeToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

const shippingAddress = {
  fullName: "Test Customer",
  phone: "9876543210",
  pincode: "110001",
  addressLine: "12 Test Street",
  city: "New Delhi",
  state: "Delhi",
};

const addCartItem = async (token, productId, weight, quantity = 1) =>
  request("/v1/cart/items", {
    method: "POST",
    token,
    body: { productId, weight, quantity },
  });

const createCodOrder = async (token, idempotencyKey = "") =>
  request("/v1/orders", {
    method: "POST",
    token,
    body: {
      shippingAddress,
      shippingMethod: "free",
      paymentMethod: "cod",
      idempotencyKey,
    },
  });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const User = mongoose.connection.collection("users");
  const Product = mongoose.connection.collection("products");

  const customer = await registerUser("customer");
  const otherCustomer = await registerUser("other");
  const adminUser = await registerUser("admin");
  await User.updateOne(
    { _id: new mongoose.Types.ObjectId(adminUser.user.id) },
    { $set: { role: "admin" } },
  );
  const adminToken = makeToken(adminUser.user.id);

  const product = await Product.findOne({ status: "active", isActive: true });
  if (!product) {
    throw new Error("No active product found");
  }

  const variant = product.weightVariants?.[0];
  if (!variant) {
    throw new Error("Product has no variants");
  }

  const productId = product._id.toString();
  const weight = variant.weight;

  // Empty cart order should fail
  const emptyOrder = await createCodOrder(customer.token);
  log("Reject order with empty cart", emptyOrder.status === 400);

  // Add item and create COD order
  const cartAdd = await addCartItem(customer.token, productId, weight, 1);
  log("Add item to cart", cartAdd.status === 200);

  const orderRes = await createCodOrder(customer.token, `idem-${unique}`);
  log(
    "Create COD order",
    orderRes.status === 201 && orderRes.data?.data?.order?.orderNumber,
    orderRes.data?.message,
  );

  const orderId = orderRes.data?.data?.order?.id;
  const orderNumber = orderRes.data?.data?.order?.orderNumber;

  // Idempotent duplicate request
  const duplicateOrder = await createCodOrder(customer.token, `idem-${unique}`);
  log(
    "Idempotent duplicate order request",
    duplicateOrder.status === 201 &&
      duplicateOrder.data?.data?.order?.id === orderId,
  );

  // Customer list orders
  const listRes = await request("/v1/orders", { token: customer.token });
  log(
    "Customer list orders",
    listRes.status === 200 && listRes.data?.data?.orders?.length >= 1,
  );

  // Customer get own order
  const getRes = await request(`/v1/orders/${orderId}`, { token: customer.token });
  log("Customer get own order", getRes.status === 200);

  // Other customer cannot access order
  const forbidden = await request(`/v1/orders/${orderId}`, { token: otherCustomer.token });
  log("Block other customer order access", forbidden.status === 404);

  // Admin list orders
  const adminList = await request("/v1/admin/orders?limit=5", { token: adminToken });
  log(
    "Admin list orders",
    adminList.status === 200 && adminList.data?.data?.pagination?.total >= 1,
  );

  // Admin get order by id
  const adminGet = await request(`/v1/admin/orders/${orderId}`, { token: adminToken });
  log("Admin get order by id", adminGet.status === 200);

  // Admin update status
  const adminUpdate = await request(`/v1/admin/orders/${orderId}/status`, {
    method: "PATCH",
    token: adminToken,
    body: {
      orderStatus: "processing",
      paymentStatus: "pending",
      note: "Test status update",
    },
  });
  log("Admin update order status", adminUpdate.status === 200);

  // Stock decrement verification
  const updatedProduct = await Product.findOne({ _id: product._id });
  const updatedVariant = updatedProduct.weightVariants.find((v) => v.weight === weight);
  log(
    "Stock decremented after order",
    Number(updatedVariant.stock) === Number(variant.stock) - 1,
    `stock=${updatedVariant.stock}`,
  );

  // Insufficient stock when ordering more than available
  const other = await registerUser("stock");
  await addCartItem(other.token, productId, weight, updatedVariant.stock + 5);
  const overStock = await createCodOrder(other.token, `over-${unique}`);
  log("Reject insufficient stock order", overStock.status === 400);

  // Invalid payment signature
  const customer2 = await registerUser("pay");
  await addCartItem(customer2.token, productId, weight, 1);

  // Create online order only if razorpay configured - otherwise skip
  const onlineOrder = await request("/v1/orders", {
    method: "POST",
    token: customer2.token,
    body: {
      shippingAddress,
      shippingMethod: "free",
      paymentMethod: "upi",
      idempotencyKey: `rzp-${unique}`,
    },
  });

  if (onlineOrder.status === 201 && onlineOrder.data?.data?.razorpay?.orderId) {
    const providerOrderId = onlineOrder.data.data.razorpay.orderId;
    const invalidVerify = await request("/v1/payments/verify", {
      method: "POST",
      token: customer2.token,
      body: {
        razorpay_order_id: providerOrderId,
        razorpay_payment_id: `pay_${unique}`,
        razorpay_signature: "invalid-signature",
      },
    });
    log("Reject invalid payment signature", invalidVerify.status === 400);

    if (process.env.RAZORPAY_KEY_SECRET) {
      const providerPaymentId = `pay_test_${unique}`;
      const payload = `${providerOrderId}|${providerPaymentId}`;
      const signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(payload)
        .digest("hex");

      const validVerify = await request("/v1/payments/verify", {
        method: "POST",
        token: customer2.token,
        body: {
          razorpay_order_id: providerOrderId,
          razorpay_payment_id: providerPaymentId,
          razorpay_signature: signature,
        },
      });
      log("Verify valid payment signature", validVerify.status === 200);

      const duplicateVerify = await request("/v1/payments/verify", {
        method: "POST",
        token: customer2.token,
        body: {
          razorpay_order_id: providerOrderId,
          razorpay_payment_id: providerPaymentId,
          razorpay_signature: signature,
        },
      });
      log(
        "Idempotent payment verification",
        duplicateVerify.status === 200 &&
          duplicateVerify.data?.data?.alreadyProcessed === true,
      );
    } else {
      log("Verify valid payment signature", true, "skipped - no RAZORPAY_KEY_SECRET");
      log("Idempotent payment verification", true, "skipped - no RAZORPAY_KEY_SECRET");
    }
  } else {
    log(
      "Online order creation",
      onlineOrder.status === 503 || onlineOrder.status === 201,
      onlineOrder.data?.message || onlineOrder.status,
    );
    log("Reject invalid payment signature", true, "skipped - no online order");
    log("Verify valid payment signature", true, "skipped - no online order");
    log("Idempotent payment verification", true, "skipped - no online order");
  }

  // Webhook signature tests
  if (process.env.RAZORPAY_WEBHOOK_SECRET) {
    const webhookBody = JSON.stringify({
      id: `evt_${unique}`,
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: `pay_webhook_${unique}`,
            order_id: onlineOrder.data?.data?.razorpay?.orderId || "order_missing",
          },
        },
      },
    });
    const badWebhook = await request("/v1/payments/webhook/razorpay", {
      method: "POST",
      headers: { "x-razorpay-signature": "bad" },
      body: webhookBody,
    });
    log("Reject invalid webhook signature", badWebhook.status === 400);

    const goodSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(webhookBody)
      .digest("hex");

    const webhookRes = await fetch(`${API}/v1/payments/webhook/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": goodSig,
      },
      body: webhookBody,
    });
    const webhookData = await webhookRes.json().catch(() => ({}));
    log(
      "Webhook idempotent replay",
      webhookRes.status === 200,
      webhookData?.data?.alreadyProcessed || webhookData?.data?.processed,
    );

    const replayRes = await fetch(`${API}/v1/payments/webhook/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": goodSig,
      },
      body: webhookBody,
    });
    const replayData = await replayRes.json().catch(() => ({}));
    log(
      "Webhook replay returns already processed",
      replayRes.status === 200 && replayData?.data?.alreadyProcessed === true,
    );
  } else {
    log("Reject invalid webhook signature", true, "skipped - no webhook secret");
    log("Webhook idempotent replay", true, "skipped - no webhook secret");
    log("Webhook replay returns already processed", true, "skipped - no webhook secret");
  }

  // Concurrent orders on limited stock product
  const lowStockProduct = await Product.findOne({
    status: "active",
    isActive: true,
    "weightVariants.stock": { $gte: 2 },
  });

  if (lowStockProduct) {
    const lowVariant = lowStockProduct.weightVariants.find((v) => Number(v.stock) >= 2);
    await Product.updateOne(
      { _id: lowStockProduct._id, "weightVariants.weight": lowVariant.weight },
      { $set: { "weightVariants.$.stock": 1 } },
    );

    const c1 = await registerUser("conc1");
    const c2 = await registerUser("conc2");
    await addCartItem(c1.token, lowStockProduct._id.toString(), lowVariant.weight, 1);
    await addCartItem(c2.token, lowStockProduct._id.toString(), lowVariant.weight, 1);

    const [r1, r2] = await Promise.all([
      createCodOrder(c1.token, `conc-${unique}-1`),
      createCodOrder(c2.token, `conc-${unique}-2`),
    ]);

    const statuses = [r1.status, r2.status].join(",");
    const successes = [r1, r2].filter((r) => r.status === 201).length;
    const failures = [r1, r2].filter((r) => r.status === 400).length;
    log(
      "Concurrent orders only one succeeds on last stock",
      successes === 1 && failures === 1,
      `statuses=${statuses} success=${successes} fail=${failures}`,
    );
  } else {
    log("Concurrent orders only one succeeds on last stock", true, "skipped - no product");
  }

  // Unauthorized admin access
  const unauthorizedAdmin = await request("/v1/admin/orders", { token: customer.token });
  log("Block non-admin orders API", unauthorizedAdmin.status === 403);

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.log(`\n${passed}/${results.length} tests passed (${failed} failed)`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
