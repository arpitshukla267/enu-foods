import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "./admin.order.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

export default router;
