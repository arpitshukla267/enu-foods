import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  mergeCart,
  updateCartItem,
  applyCartCoupon,
  removeCartCoupon,
} from "./cart.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/items", addCartItem);
router.post("/merge", mergeCart);
router.patch("/items/:itemId", updateCartItem);
router.delete("/items/:itemId", deleteCartItem);
router.post("/coupon", applyCartCoupon);
router.delete("/coupon", removeCartCoupon);
router.delete("/", clearCart);

export default router;
