import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { getPaymentConfig, verifyPayment } from "./payment.controller.js";

const router = express.Router();

router.get("/config", getPaymentConfig);
router.post("/verify", authenticate, verifyPayment);

export default router;
