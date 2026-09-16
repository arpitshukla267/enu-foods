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
    name: `Dashboard Tester ${roleSuffix}`,
    email: `dashboard.test.${roleSuffix}.${unique}@example.com`,
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

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.connection.collection("users");

  const customer = await registerUser("customer");
  const adminUser = await registerUser("admin");
  await User.updateOne(
    { _id: new mongoose.Types.ObjectId(adminUser.user.id) },
    { $set: { role: "admin" } },
  );
  const adminToken = makeToken(adminUser.user.id);

  const summary = await request("/v1/admin/dashboard/summary", { token: adminToken });
  log("Dashboard summary returns 200", summary.status === 200);
  log(
    "Dashboard summary has counts",
    summary.data?.data?.summary &&
      typeof summary.data.data.summary.pendingOrders === "number" &&
      typeof summary.data.data.summary.lowStock === "number",
  );

  const dashboard = await request("/v1/admin/dashboard?range=30d", { token: adminToken });
  log("Dashboard returns 200", dashboard.status === 200);

  const payload = dashboard.data?.data;
  log("Dashboard has summary object", Boolean(payload?.summary));
  log("Dashboard has stats object", Boolean(payload?.stats));
  log(
    "Dashboard recent orders capped",
    Array.isArray(payload?.recentOrders) && payload.recentOrders.length <= 7,
    `count ${payload?.recentOrders?.length ?? 0}`,
  );
  log(
    "Dashboard top buyers capped",
    Array.isArray(payload?.topBuyers) && payload.topBuyers.length <= 6,
    `count ${payload?.topBuyers?.length ?? 0}`,
  );
  log(
    "Dashboard stats include revenueByDate array",
    Array.isArray(payload?.stats?.revenueByDate),
  );

  const range7d = await request("/v1/admin/dashboard?range=7d", { token: adminToken });
  log("Dashboard supports 7d range", range7d.status === 200);

  const unauthorized = await request("/v1/admin/dashboard", { token: customer.token });
  log("Customer blocked from dashboard", unauthorized.status === 403);

  const noToken = await request("/v1/admin/dashboard");
  log("Dashboard requires auth", noToken.status === 401);

  await mongoose.disconnect();

  const failed = results.filter((item) => !item.passed);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) {
    process.exit(1);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
