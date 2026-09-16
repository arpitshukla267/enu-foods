import express from "express";

import {
  getCombos,
  getComboById,
  createComboHandler,
  updateComboHandler,
  deleteComboHandler,
} from "./admin.combo.controller.js";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", getCombos);
router.post("/", createComboHandler);
router.get("/:id", getComboById);
router.patch("/:id", updateComboHandler);
router.delete("/:id", deleteComboHandler);

export default router;
