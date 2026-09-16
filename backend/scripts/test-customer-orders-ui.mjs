import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const API = "http://localhost:5000/api";
const results = [];

const log = (name, passed, detail = "") => {
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"} - ${name}${detail ? `: ${detail}` : ""}`);
};

const request = async (path, { method = "GET", token, body } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
};

const unique = Date.now();

const registerUser = async (suffix) => {
  const response = await request("/auth/register", {
    method: "POST",
    body: {
      name: `Orders UI Tester ${suffix}`,
      email: `orders.ui.${suffix}.${unique}@example.com`,
      phone: `${String(unique + suffix.length).slice(-10)}`,
      password: "TestPass123!",
    },
  });
  if (response.status !== 201) {
    throw new Error(`Register failed: ${response.data.message}`);
  }
  return {
    token: response.data.data.token,
    user: response.data.data.user,
  };
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const User = mongoose.connection.collection("users");
  const Product = mongoose.connection.collection("products");
  const Cart = mongoose.connection.collection("carts");

  const customer = await registerUser("cust");
  const other = await registerUser("other");
  const emptyUser = await registerUser("empty");

  const product = await Product.findOne({ status: "active", isActive: true });
  const variant = product.weightVariants[0];
  await Product.updateOne(
    { _id: product._id, "weightVariants.weight": variant.weight },
    { $set: { "weightVariants.$.stock": 50 } },
  );

  await request("/v1/cart/items", {
    method: "POST",
    token: customer.token,
    body: {
      productId: product._id.toString(),
      weight: variant.weight,
      quantity: 1,
    },
  });

  const createRes = await request("/v1/orders", {
    method: "POST",
    token: customer.token,
    body: {
      shippingAddress: {
        fullName: "Test",
        phone: "9876543210",
        pincode: "110001",
        addressLine: "Line 1",
        city: "Delhi",
        state: "Delhi",
      },
      shippingMethod: "free",
      paymentMethod: "cod",
      idempotencyKey: `ui-${unique}`,
    },
  });

  const orderId = createRes.data?.data?.order?.id;
  log("Create order for customer UI tests", createRes.status === 201 && orderId);

  const emptyList = await request("/v1/orders?limit=10&page=1", { token: emptyUser.token });
  log(
    "Empty orders list for new customer",
    emptyList.status === 200 && emptyList.data?.data?.orders?.length === 0,
    `count=${emptyList.data?.data?.orders?.length ?? "?"}`,
  );

  const page1 = await request("/v1/orders?limit=1&page=1", { token: customer.token });
  const page2 = await request("/v1/orders?limit=1&page=2", { token: customer.token });
  log(
    "Paginated list page 1",
    page1.status === 200 && page1.data?.data?.pagination?.page === 1,
  );
  log(
    "Paginated list page 2 independent",
    page2.status === 200,
    `page=${page2.data?.data?.pagination?.page}`,
  );

  const detail = await request(`/v1/orders/${orderId}`, { token: customer.token });
  log(
    "Order detail by ID includes snapshots",
    detail.status === 200 &&
      detail.data?.data?.order?.items?.length > 0 &&
      detail.data?.data?.order?.shippingAddress?.city &&
      typeof detail.data?.data?.order?.subtotal === "number",
  );

  log(
    "Order detail includes status timeline",
    Array.isArray(detail.data?.data?.order?.statusHistory),
    `entries=${detail.data?.data?.order?.statusHistory?.length ?? 0}`,
  );

  const forbidden = await request(`/v1/orders/${orderId}`, { token: other.token });
  log("Other customer cannot access order detail", forbidden.status === 404);

  const invalidId = await request("/v1/orders/not-a-valid-id", { token: customer.token });
  log("Invalid order ID rejected", invalidId.status === 400);

  const missing = await request(`/v1/orders/${new mongoose.Types.ObjectId()}`, {
    token: customer.token,
  });
  log("Unknown order ID returns 404", missing.status === 404);

  const noAuth = await request("/v1/orders");
  log("Unauthenticated list blocked", noAuth.status === 401);

  const listPayload = JSON.stringify(page1.data?.data ?? {});
  log(
    "List response lightweight (single order page)",
    listPayload.length < 15000,
    `bytes=${listPayload.length}`,
  );

  const detailPayload = JSON.stringify(detail.data?.data ?? {});
  log(
    "Detail response lightweight",
    detailPayload.length < 10000,
    `bytes=${detailPayload.length}`,
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.log(`\nCustomer orders UI API checks: ${passed}/${results.length} passed (${failed} failed)`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
