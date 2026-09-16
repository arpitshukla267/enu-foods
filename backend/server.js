import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { isRazorpayConfigured } from "./src/services/payment/gateways/razorpayGateway.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ENU Foods API running on port ${PORT}`);
      if (isRazorpayConfigured()) {
        console.log("Razorpay online payments: ENABLED");
      } else {
        console.warn(
          "Razorpay online payments: DISABLED (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env)",
        );
      }
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
