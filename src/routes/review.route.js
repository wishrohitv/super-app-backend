import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  reviewVote,
} from "../controllers/review.controller.js";
const router = Router();

router.post(
  "/create/:productId",
  verifyJWT,
  upload.array("reviewFiles", 5),
  createReview
);

router.put("/update/:reviewId", verifyJWT, upload.none(), updateReview);
router.get("/:reviewId", upload.none(), getReviewById);
router.post("/vote/:reviewId", verifyJWT, upload.none(), reviewVote);

export default router;
