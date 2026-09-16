import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amountPaise: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "INR", uppercase: true },
    provider: {
      type: String,
      enum: ["razorpay", "cod"],
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "pending", "success", "failed"],
      default: "created",
      index: true,
    },
    providerOrderId: { type: String, trim: true, index: true },
    providerPaymentId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    idempotencyKey: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    webhookEventId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    failureReason: { type: String, trim: true, default: "" },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

paymentSchema.index({ order: 1, provider: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
