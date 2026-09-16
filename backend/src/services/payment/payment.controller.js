import { verifyOnlinePayment, handleRazorpayWebhook } from "./payment.service.js";
import {
  getRazorpayKeyId,
  isRazorpayConfigured,
} from "./gateways/razorpayGateway.js";

export const getPaymentConfig = async (req, res, next) => {
  try {
    const onlineEnabled = isRazorpayConfigured();

    return res.status(200).json({
      success: true,
      message: onlineEnabled
        ? "Online payments are available"
        : "Online payments are not configured",
      data: {
        onlineEnabled,
        providers: {
          razorpay: onlineEnabled,
          cod: true,
        },
        // Publishable key only — never expose RAZORPAY_KEY_SECRET
        keyId: onlineEnabled ? getRazorpayKeyId() : null,
        methods: onlineEnabled
          ? ["upi", "card", "netbanking", "cod"]
          : ["cod"],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const result = await verifyOnlinePayment(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: result.alreadyProcessed
        ? "Payment already verified"
        : "Payment verified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const razorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const result = await handleRazorpayWebhook(rawBody, signature);

    return res.status(200).json({
      success: true,
      message: "Webhook processed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
