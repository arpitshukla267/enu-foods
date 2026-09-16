import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  getCoupons,
  getCouponById,
  createCouponHandler,
  updateCouponHandler,
  updateCouponStatusHandler,
  deleteCouponHandler,
} from "./coupon.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", getCoupons);
router.post("/", createCouponHandler);
router.get("/:id", getCouponById);
router.patch("/:id", updateCouponHandler);
router.patch("/:id/status", updateCouponStatusHandler);
router.delete("/:id", deleteCouponHandler);

export default router;
