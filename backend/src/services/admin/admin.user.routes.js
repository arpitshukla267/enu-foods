import express from "express";

import {
  getUsers,
  getUserById,
  getUsersStats,
} from "./admin.user.controller.js";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/stats", getUsersStats);
router.get("/", getUsers);
router.get("/:id", getUserById);

export default router;
