import express from "express";

import { registerUser, loginUser, getMe } from "./auth.controller.js";

import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authenticate, getMe);

export default router;
