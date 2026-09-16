import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true, trim: true },
    productSlug: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    sku: { type: String, trim: true, default: "" },
    weight: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPricePaise: { type: Number, required: true, min: 0 },
    subtotalPaise: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    addressLine: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const couponSnapshotSchema = new mongoose.Schema(
  {
    code: { type: String, trim: true, uppercase: true },
    discountPaise: { type: Number, min: 0, default: 0 },
  },
  { _id: false },
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    paymentStatus: { type: String },
    note: { type: String, trim: true, default: "" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => Array.isArray(v) && v.length > 0, "Order must have items"],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: ["free", "express"],
      default: "free",
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "cod"],
      required: true,
    },
    subtotalPaise: { type: Number, required: true, min: 0 },
    discountPaise: { type: Number, min: 0, default: 0 },
    shippingPaise: { type: Number, min: 0, default: 0 },
    taxPaise: { type: Number, min: 0, default: 0 },
    totalPaise: { type: Number, required: true, min: 0 },
    coupon: {
      type: couponSnapshotSchema,
      default: null,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending_payment",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "payment_failed",
      ],
      default: "pending_payment",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    trackingNumber: { type: String, trim: true, default: "" },
    carrier: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    idempotencyKey: { type: String, trim: true },
    stockReserved: { type: Boolean, default: false },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ user: 1, idempotencyKey: 1 }, {
  unique: true,
  partialFilterExpression: { idempotencyKey: { $type: "string", $ne: "" } },
});
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ orderNumber: "text" });

const Order = mongoose.model("Order", orderSchema);

export default Order;
