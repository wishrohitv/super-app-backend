import { BuyLink } from "../models/buylink.model.js";
import { Product } from "../models/product.model.js";
import { Company } from "../models/company.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";

const createBuyLink = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { url, companyId } = req.body;
  const userId = req.user._id;

  if (!url || !companyId) {
    throw new BadRequestError("URL and Company ID are required");
  }

  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(companyId)
  ) {
    throw new BadRequestError("Invalid Product ID or Company ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    throw new NotFoundError("Company not found");
  }

  const newBuyLink = await BuyLink.create({
    productId,
    url,
    companyId,
    authorId: userId,
  });
  return res
    .status(201)
    .json(
      new SuccessResponse(201, newBuyLink, "Buy link created successfully")
    );
});

const updateBuyLink = asyncHandler(async (req, res) => {
  const buyLinkId = req.params.buyLinkId;
  const productId = req.params.productId;
  const { url, companyId } = req.body;
  const userId = req.user._id;

  if (!url || !companyId) {
    throw new BadRequestError("URL and Company ID are required");
  }

  if (
    !mongoose.Types.ObjectId.isValid(buyLinkId) ||
    !mongoose.Types.ObjectId.isValid(companyId)
  ) {
    throw new BadRequestError("Invalid Buy Link ID or Company ID");
  }
  const buyLink = await BuyLink.findById(buyLinkId);
  if (!buyLink) {
    throw new NotFoundError("Buy link not found");
  }

  if (
    buyLink.url === url ||
    buyLink.companyId.toString() === companyId.toString()
  ) {
    throw new BadRequestError("No changes detected in the buy link");
  }

  if (buyLink.authorId.toString() !== userId.toString()) {
    throw new BadRequestError("You are not authorized to update this buy link");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    throw new NotFoundError("Company not found");
  }

  buyLink.url = url;
  buyLink.companyId = companyId;

  const updatedBuyLink = await buyLink.save();
  if (!updatedBuyLink) {
    throw new InternalServerError("Failed to update buy link");
  }
  return res
    .status(200)
    .json(
      new SuccessResponse(200, updatedBuyLink, "Buy link updated successfully")
    );
});

export { createBuyLink, updateBuyLink };
