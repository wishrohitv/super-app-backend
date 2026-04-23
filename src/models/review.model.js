import mongoose from "mongoose";
import { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    comment: {
      type: String,
      maxlength: 500,
      required: true,
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    uploadedfile: [
      {
        // The main, direct link to the asset
        public_url: {
          type: String,
          required: true,
        },
        // The Map stores different versions (e.g., 'image/video': 'url', 'original': 'url')
        versions: {
          type: Map,
          of: String,
        },
        // The Metadata stores the "facts" about the file
        metadata: {
          public_id: String,
          resource_type: { type: String, enum: ["image", "video"] },
          format: String,
          bytes: Number,
          width: Number,
          height: Number,
          duration: Number, // null for images
          blurhash: String, // Useful for "loading" placeholders
        },
        uploaded_at: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model("Review", reviewSchema);
