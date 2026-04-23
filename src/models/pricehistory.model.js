import { Schema } from "mongoose";
import mongoose from "mongoose";

const priceHistorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null, // Null indicates the current active price
      index: true,
    },
  },
  { timestamps: true }
);

// Compound Index: Speeds up finding the price for a specific product at a specific time
priceHistorySchema.index({ productId: 1, startDate: -1, endDate: 1 });

export const PriceHistory = mongoose.model("PriceHistory", priceHistorySchema);
