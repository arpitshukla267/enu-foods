import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { getDashboard, getSummary } from "./admin.dashboard.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/summary", getSummary);
router.get("/", getDashboard);

export default router;
