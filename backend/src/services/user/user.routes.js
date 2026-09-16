import express from "express";

import { getProfile } from "./user.controller.js";

import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.get("/me", authenticate, getProfile);

export default router;
