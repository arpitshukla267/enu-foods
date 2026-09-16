import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  getRecipes,
  getRecipeById,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
} from "./admin.recipe.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", getRecipes);
router.post("/", createRecipeHandler);
router.get("/:id", getRecipeById);
router.patch("/:id", updateRecipeHandler);
router.delete("/:id", deleteRecipeHandler);

export default router;
