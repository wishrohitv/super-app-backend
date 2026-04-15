import mongoose, { Schema } from "mongoose";

const buyLinkSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  platform: {
    type: Schema.Types.ObjectId,
    ref: "Platform",
    required: true,
  },
});

export const BuyLink = mongoose.model("BuyLink", buyLinkSchema);
