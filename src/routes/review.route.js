import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
const router = Router();

router.post(
  "/create/:productId",
  verifyJWT,
  upload.array("review-files", 5),
  createReview
);

export default router;
