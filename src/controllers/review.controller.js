import { Review } from "../models/review.model.js";
import { NotFoundError, RequestTimeoutError } from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createReview = asyncHandler(async (req, res) => {});
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
