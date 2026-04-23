import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
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
});

export const Product = mongoose.model("Product", productSchema);
