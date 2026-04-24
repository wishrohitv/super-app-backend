import { Review } from "../models/review.model.js";
import { ReviewHistory } from "../models/reviewhistory.model.js";
import {
  NotFoundError,
  RequestTimeoutError,
  InternalServerError,
  ConflictError,
  BadRequestError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { deleteFile, uploadFiles } from "../services/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";

const createReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { text, rating } = req.body;
  const reviewFiles = req.files;

  const existingReview = await Review.findOne({
    userId: userId,
    productId: productId,
  });

  if (existingReview) {
    throw new ConflictError("Review already exists for this product");
  }
  let storeFileMetadata;

  if (uploadFiles?.length > 0) {
    const results = await Promise.allSettled(
      reviewFiles.map((file) => uploadFiles(file.path))
    );

    const successfullUploads = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    const hasFailure = results.some((r) => r.status === "rejected");

    if (hasFailure) {
      // Cleanup uploaded files from Cloudinary
      await Promise.all(
        successfullUploads.map((file) => deleteFile(file.public_id))
      );

      throw new InternalServerError(
        "Failed to upload all review files, please try again"
      );
    }

    storeFileMetadata = successfullUploads.map((file) => {
      return {
        // The main, direct link to the asset
        public_url: file.secure_url,
        // The Metadata stores the "facts" about the file
        metadata: {
          public_id: file.public_id,
          resource_type: file.resource_type,
          format: file.format,
          bytes: file.bytes,
          width: file.width,
          height: file.height,
        },
      };
    });
  }

  const review = await Review.create({
    userId,
    productId,
    text,
    rating,
    uploadedfile: storeFileMetadata ?? [],
  });

  if (!review) {
    throw new InternalServerError("Failed to create review");
  }
  res
    .status(201)
    .json(new SuccessResponse(201, review, "Review created successfully"));
});
const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { reviewId } = req.params;
  const { text, rating } = req.body;

  if (!text && !rating) {
    throw new BadRequestError(
      "At least one of text or rating must be provided for update"
    );
  }

  const review = await Review.findOne({
    _id: reviewId,
    userId,
  });

  if (!review) {
    throw new NotFoundError("Review not found");
  }
  let reviewText = text ?? review.text;
  let reviewRating = rating ?? review.rating;

  const updatedReview = await Review.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(reviewId),
      userId: new mongoose.Types.ObjectId(userId),
    },
    {
      text: reviewText,
      rating: reviewRating,
    },
    {
      returnDocument: "after",
    }
  );

  if (!updatedReview) {
    throw new InternalServerError("Failed to update review");
  }

  const reviewHistoryEntry = await ReviewHistory.create({
    reviewId,
    text: reviewText,
    rating: reviewRating,
  });

  if (!reviewHistoryEntry) {
    const rolledBackReview = await Review.findOneAndUpdate(
      {
        _id: reviewId,
        userId: userId,
      },
      {
        text: review.text,
        rating: review.rating,
      },
      {
        returnDocument: "after",
      }
    );
    throw new InternalServerError("Failed to create review history entry");
  }

  res
    .status(200)
    .json(
      new SuccessResponse(200, updatedReview, "Review updated successfully")
    );
});
const getAllReviews = asyncHandler(async (req, res) => {});
const getReviewById = asyncHandler(async (req, res) => {});
const deleteReview = asyncHandler(async (req, res) => {});

export {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
