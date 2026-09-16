import express from "express";
import { getRecipes, getRecipeBySlug } from "./recipe.controller.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:slug", getRecipeBySlug);

export default router;
