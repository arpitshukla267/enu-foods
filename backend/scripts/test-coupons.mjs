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

const registerUser = async (roleSuffix) => {
  const payload = {
    name: `Coupon Tester ${roleSuffix}`,
    email: `coupon.test.${roleSuffix}.${unique}@example.com`,
    phone: `9${String(unique).slice(-9)}`,
    password: "TestPass123!",
  };

  const response = await request("/auth/register", { method: "POST", body: payload });
  if (response.status !== 201) {
    throw new Error(`Register failed: ${response.data.message || response.status}`);
  }

  return {
    token: response.data.data.token,
    user: response.data.data.user,
    payload,
  };
};

const makeToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const User = mongoose.connection.collection("users");
  const Product = mongoose.connection.collection("products");
  const Category = mongoose.connection.collection("categories");

  const customer = await registerUser("customer");
  const adminUser = await registerUser("admin");
  await User.updateOne({ _id: new mongoose.Types.ObjectId(adminUser.user.id) }, { $set: { role: "admin" } });
  const adminToken = makeToken(adminUser.user.id);

  const product = await Product.findOne({ status: "active", isActive: true });
  if (!product) {
    throw new Error("No active product found for cart tests");
  }

  const category = product.category
    ? await Category.findOne({ _id: product.category })
    : null;

  const variant = product.weightVariants?.[0];
  if (!variant) {
    throw new Error("Product has no weight variants");
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const createCoupon = async (code, overrides = {}) => {
    const response = await request("/v1/admin/coupons", {
      method: "POST",
      token: adminToken,
      body: {
        code,
        description: `Test coupon ${code}`,
        discountType: "percentage",
        discountValue: 10,
        minimumCartValue: 0,
        maximumDiscount: 0,
        startDate: yesterday.toISOString(),
        expiryDate: nextWeek.toISOString(),
        usageLimit: 0,
        perUserLimit: 0,
        applicableProducts: [],
        applicableCategories: [],
        isActive: true,
        ...overrides,
      },
    });

    if (response.status !== 201) {
      throw new Error(`Create coupon ${code} failed: ${response.data.message}`);
    }

    return response.data.data.coupon;
  };

  const addCartItem = async () => {
    const response = await request("/v1/cart/items", {
      method: "POST",
      token: customer.token,
      body: {
        productId: product._id.toString(),
        weight: variant.weight,
        quantity: 2,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Add cart item failed: ${response.data.message}`);
    }

    return response.data.data.cart;
  };

  await addCartItem();

  // 12. customer cannot access admin endpoints
  {
    const denied = await request("/v1/admin/coupons", { token: customer.token });
    log("Customer blocked from admin coupon list", denied.status === 403, `status ${denied.status}`);
  }

  const pctCoupon = await createCoupon(`PCT${unique}`, {
    discountType: "percentage",
    discountValue: 10,
  });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: pctCoupon.code },
    });
    const cart = applied.data.data.cart;
    log(
      "Percentage coupon applies",
      applied.status === 200 && cart.coupon?.code === pctCoupon.code && cart.discount > 0,
      `discount ${cart.discount}`,
    );
  }

  await request("/v1/cart/coupon", { method: "DELETE", token: customer.token });

  const fixedCoupon = await createCoupon(`FIX${unique}`, {
    discountType: "fixed",
    discountValue: 50,
  });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: fixedCoupon.code },
    });
    const cart = applied.data.data.cart;
    log(
      "Fixed coupon applies",
      applied.status === 200 && cart.discount > 0,
      `discount ${cart.discount}`,
    );
  }

  await request("/v1/cart/coupon", { method: "DELETE", token: customer.token });

  const maxDiscCoupon = await createCoupon(`MAX${unique}`, {
    discountType: "percentage",
    discountValue: 50,
    maximumDiscount: 20,
  });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: maxDiscCoupon.code },
    });
    const cart = applied.data.data.cart;
    log(
      "Maximum discount cap enforced",
      applied.status === 200 && cart.discount <= 20,
      `discount ${cart.discount}`,
    );
  }

  await request("/v1/cart/coupon", { method: "DELETE", token: customer.token });

  const minCartCoupon = await createCoupon(`MIN${unique}`, {
    minimumCartValue: 999999,
  });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: minCartCoupon.code },
    });
    log(
      "Minimum cart value enforced",
      applied.status === 400,
      applied.data.message,
    );
  }

  const inactiveCoupon = await createCoupon(`INACTIVE${unique}`, { isActive: false });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: inactiveCoupon.code },
    });
    log("Inactive coupon rejected", applied.status === 400, applied.data.message);
  }

  const expiredCoupon = await createCoupon(`EXP${unique}`, {
    startDate: lastWeek.toISOString(),
    expiryDate: yesterday.toISOString(),
  });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: expiredCoupon.code },
    });
    log("Expired coupon rejected", applied.status === 400, applied.data.message);
  }

  const futureCoupon = await createCoupon(`FUTURE${unique}`, {
    startDate: tomorrow.toISOString(),
    expiryDate: nextWeek.toISOString(),
  });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: futureCoupon.code },
    });
    log("Future coupon rejected", applied.status === 400, applied.data.message);
  }

  const usageLimitCoupon = await createCoupon(`LIMIT${unique}`, {
    usageLimit: 1,
    usedCount: 1,
  });

  await mongoose.connection.collection("coupons").updateOne(
    { code: usageLimitCoupon.code },
    { $set: { usedCount: 1 } },
  );

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: usageLimitCoupon.code },
    });
    log("Usage limit enforced", applied.status === 400, applied.data.message);
  }

  const perUserCoupon = await createCoupon(`PERUSER${unique}`, {
    perUserLimit: 1,
  });

  await mongoose.connection.collection("couponusages").insertOne({
    coupon: new mongoose.Types.ObjectId(perUserCoupon.id),
    user: new mongoose.Types.ObjectId(customer.user.id),
    usageCount: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: perUserCoupon.code },
    });
    log("Per-user limit enforced", applied.status === 400, applied.data.message);
  }

  const productRestricted = await createCoupon(`PROD${unique}`, {
    applicableProducts: [product._id.toString()],
  });

  {
    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: productRestricted.code },
    });
    log(
      "Product restriction allows matching cart item",
      applied.status === 200,
      applied.data.message,
    );
  }

  await request("/v1/cart/coupon", { method: "DELETE", token: customer.token });

  if (category) {
    const categoryRestricted = await createCoupon(`CAT${unique}`, {
      applicableCategories: [category._id.toString()],
    });

    const applied = await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: categoryRestricted.code },
    });

    log(
      "Category restriction allows matching cart item",
      applied.status === 200,
      applied.data.message,
    );

    await request("/v1/cart/coupon", { method: "DELETE", token: customer.token });
  } else {
    log("Category restriction allows matching cart item", true, "skipped - no category on product");
  }

  const invalidOnMutation = await createCoupon(`MUTATE${unique}`, {
    minimumCartValue: 1,
  });

  {
    await request("/v1/cart/coupon", {
      method: "POST",
      token: customer.token,
      body: { code: invalidOnMutation.code },
    });

    await request("/v1/cart", { method: "DELETE", token: customer.token });

    const cartResponse = await request("/v1/cart", { token: customer.token });
    const cart = cartResponse.data.data.cart;
    log(
      "Cart mutation invalidates coupon when cart becomes ineligible",
      !cart.coupon && cart.discount === 0,
      `coupon ${cart.coupon?.code || "none"}`,
    );
  }

  {
    const list = await request("/v1/admin/coupons?page=1&limit=5", { token: adminToken });
    log(
      "Admin coupon list paginated",
      list.status === 200 && Array.isArray(list.data.data.coupons),
      `count ${list.data.data.coupons?.length || 0}`,
    );
  }

  const passed = results.filter((entry) => entry.passed).length;
  const failed = results.length - passed;
  console.log(`\nSummary: ${passed}/${results.length} passed, ${failed} failed`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
