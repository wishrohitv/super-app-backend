import mongoose, { Schema } from "mongoose";

const reviewHistorySchema = new Schema(
  {
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
      index: true, // Index for efficient querying by reviewId
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewHistory = mongoose.model(
  "ReviewHistory",
  reviewHistorySchema
);
