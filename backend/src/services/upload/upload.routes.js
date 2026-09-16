import express from "express";
import multer from "multer";

import { uploadImageBuffer } from "../../config/cloudinary.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }

    cb(null, true);
  },
});

router.post(
  "/image",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      const uploaded = await uploadImageBuffer(req.file.buffer);

      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        data: uploaded,
      });
    } catch (error) {
      if (error.message === "Only image uploads are allowed") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      next(error);
    }
  },
);

export default router;
