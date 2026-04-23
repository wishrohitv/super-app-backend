import { Review } from "../models/review.model.js";
import { ReviewHistory } from "../models/reviewhistory.model.js";
import {
  NotFoundError,
  RequestTimeoutError,
  InternalServerError,
  ConflictError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { text, rating } = req.body;
  const { "review-files": review_files } = req.files;

  const existingReview = await Review.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    productId: new mongoose.Types.ObjectId(productId),
  });

  if (existingReview) {
    throw new ConflictError("Review already exists for this product");
  }

  const review = await Review.create({
    userId,
    productId,
    text,
    rating,
  });

  if (!review) {
    throw new InternalServerError("Failed to create review");
  }
  res
    .status(201)
    .json(new SuccessResponse(201, review, "Review created successfully"));
});
const getAllReviews = asyncHandler(async (req, res) => {});
const getReviewById = asyncHandler(async (req, res) => {});
const updateReview = asyncHandler(async (req, res) => {});
const deleteReview = asyncHandler(async (req, res) => {});

export {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
