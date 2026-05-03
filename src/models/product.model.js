import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },
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
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
