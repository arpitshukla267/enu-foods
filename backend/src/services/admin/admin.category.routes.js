import express from "express";

import {
  getCategories,
  getCategoryById,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  createSubcategoryHandler,
  updateSubcategoryHandler,
  deleteSubcategoryHandler,
} from "./admin.category.controller.js";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", getCategories);
router.post("/", createCategoryHandler);
router.get("/:id", getCategoryById);
router.patch("/:id", updateCategoryHandler);
router.delete("/:id", deleteCategoryHandler);
router.post("/:id/subcategories", createSubcategoryHandler);
router.patch("/:id/subcategories/:subcategoryId", updateSubcategoryHandler);
router.delete("/:id/subcategories/:subcategoryId", deleteSubcategoryHandler);

export default router;
