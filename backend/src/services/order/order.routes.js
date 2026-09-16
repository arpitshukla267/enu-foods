import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { createOrder, getOrderById, getOrders } from "./order.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

export default router;
