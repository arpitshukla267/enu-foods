import mongoose from "mongoose";
import Payment from "./payment.model.js";
import {
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from "./gateways/razorpayGateway.js";
import {
  markOrderPaymentFailed,
  markOrderPaymentSuccess,
} from "../order/order.service.js";
import { validateVerifyPaymentPayload } from "../order/order.validation.js";

export const verifyOnlinePayment = async (userId, payload) => {
  const { providerOrderId, providerPaymentId, signature } =
    validateVerifyPaymentPayload(payload);

  const payment = await Payment.findOne({
    providerOrderId,
    user: userId,
    provider: "razorpay",
  });

  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }

  if (payment.status === "success") {
    return { payment, alreadyProcessed: true };
  }

  const isValid = verifyRazorpayPaymentSignature({
    providerOrderId,
    providerPaymentId,
    signature,
  });

  if (!isValid) {
    const error = new Error("Invalid payment signature");
    error.statusCode = 400;
    throw error;
  }

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      result = await markOrderPaymentSuccess({
        orderId: payment.order,
        providerPaymentId,
        session,
      });
    });
  } catch (error) {
    if (error.code === 11000) {
      return { alreadyProcessed: true };
    }
    throw error;
  } finally {
    session.endSession();
  }

  return { ...result, alreadyProcessed: false };
};

export const handleRazorpayWebhook = async (rawBody, signature) => {
  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    const error = new Error("Invalid webhook signature");
    error.statusCode = 400;
    throw error;
  }

  const event = JSON.parse(rawBody.toString());
  const eventId = event?.id;
  const eventType = event?.event;
  const paymentEntity = event?.payload?.payment?.entity;
  const providerOrderId = paymentEntity?.order_id;
  const providerPaymentId = paymentEntity?.id;

  if (!eventId || !providerOrderId) {
    return { processed: false, reason: "ignored" };
  }

  const existingWebhook = await Payment.findOne({ webhookEventId: eventId }).lean();
  if (existingWebhook) {
    return { processed: true, alreadyProcessed: true };
  }

  const payment = await Payment.findOne({ providerOrderId, provider: "razorpay" });
  if (!payment) {
    return { processed: false, reason: "payment_not_found" };
  }

  const session = await mongoose.startSession();

  const runIdempotentTransaction = async (operation) => {
    try {
      await session.withTransaction(operation);
      return { alreadyProcessed: false };
    } catch (error) {
      if (error.code === 11000) {
        return { alreadyProcessed: true };
      }
      throw error;
    }
  };

  try {
    if (eventType === "payment.captured") {
      const outcome = await runIdempotentTransaction(async () => {
        await markOrderPaymentSuccess({
          orderId: payment.order,
          providerPaymentId,
          webhookEventId: eventId,
          session,
        });
      });
      return {
        processed: true,
        status: "success",
        alreadyProcessed: outcome.alreadyProcessed,
      };
    }

    if (eventType === "payment.failed") {
      const outcome = await runIdempotentTransaction(async () => {
        await markOrderPaymentFailed({
          orderId: payment.order,
          reason: paymentEntity?.error_description || "Payment failed",
          session,
        });
      });
      return {
        processed: true,
        status: "failed",
        alreadyProcessed: outcome.alreadyProcessed,
      };
    }
  } finally {
    session.endSession();
  }

  return { processed: false, reason: "ignored_event" };
};
