import express from "express";
import { getCombos, getComboBySlug } from "./combo.controller.js";

const router = express.Router();

router.get("/", getCombos);
router.get("/:slug", getComboBySlug);

export default router;
