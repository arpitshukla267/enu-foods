import express from "express";

import {
  getProducts,
  getProductById,
  createProductHandler,
  updateProductHandler,
  updateProductStatusHandler,
  deleteProductHandler,
} from "./admin.product.controller.js";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", getProducts);
router.post("/", createProductHandler);
router.get("/:id", getProductById);
router.patch("/:id", updateProductHandler);
router.patch("/:id/status", updateProductStatusHandler);
router.delete("/:id", deleteProductHandler);

export default router;
