import { Schema } from "mongoose";

const reviewHistorySchema = new Schema(
  {
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: null, // Set to null when the review is created, updated when the review is edited
    },
  },
  {
    timestamps: true,
  }
);
