import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const isRazorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export const createRazorpayOrder = async ({
  amountPaise,
  receipt,
  notes = {},
}) => {
  const instance = getRazorpayInstance();
  if (!instance) {
    const error = new Error("Online payments are not configured");
    error.statusCode = 503;
    throw error;
  }

  const order = await instance.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes,
  });

  return {
    providerOrderId: order.id,
    amountPaise: Number(order.amount),
    currency: order.currency,
    raw: order,
  };
};

export const verifyRazorpayPaymentSignature = ({
  providerOrderId,
  providerPaymentId,
  signature,
}) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return false;
  }

  const payload = `${providerOrderId}|${providerPaymentId}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  return expected === signature;
};

export const verifyRazorpayWebhookSignature = (rawBody, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
};

export const getRazorpayKeyId = () => process.env.RAZORPAY_KEY_ID || "";
