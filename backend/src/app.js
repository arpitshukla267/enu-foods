import express from "express";
import cors from "cors";

import authRoutes from "./services/auth/auth.routes.js";
import userRoutes from "./services/user/user.routes.js";
import adminUserRoutes from "./services/admin/admin.user.routes.js";
import adminCategoryRoutes from "./services/admin/admin.category.routes.js";
import adminProductRoutes from "./services/admin/admin.product.routes.js";
import adminComboRoutes from "./services/admin/admin.combo.routes.js";
import adminRecipeRoutes from "./services/admin/admin.recipe.routes.js";
import adminOrderRoutes from "./services/admin/admin.order.routes.js";
import adminDashboardRoutes from "./services/admin/admin.dashboard.routes.js";
import categoryRoutes from "./services/category/category.routes.js";
import productRoutes from "./services/product/product.routes.js";
import comboRoutes from "./services/combo/combo.routes.js";
import recipeRoutes from "./services/recipe/recipe.routes.js";
import cartRoutes from "./services/cart/cart.routes.js";
import couponRoutes from "./services/coupon/coupon.routes.js";
import orderRoutes from "./services/order/order.routes.js";
import paymentRoutes from "./services/payment/payment.routes.js";
import { razorpayWebhook } from "./services/payment/payment.controller.js";
import uploadRoutes from "./services/upload/upload.routes.js";
import settingRoutes from "./services/settings/setting.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:3002",
  "https://enu-foods-admin.vercel.app",
  "https://enu-foods.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(
  "/api/v1/payments/webhook/razorpay",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body;
    next();
  },
  razorpayWebhook,
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ENU Foods API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/combos", comboRoutes);
app.use("/api/v1/recipes", recipeRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/admin/categories", adminCategoryRoutes);
app.use("/api/v1/admin/products", adminProductRoutes);
app.use("/api/v1/admin/combos", adminComboRoutes);
app.use("/api/v1/admin/recipes", adminRecipeRoutes);
app.use("/api/v1/admin/coupons", couponRoutes);
app.use("/api/v1/admin/orders", adminOrderRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/settings", settingRoutes);
app.use("/api/v1/admin/settings", settingRoutes);
app.use("/api/v1/admin/uploads", uploadRoutes);

app.use(errorHandler);

export default app;
