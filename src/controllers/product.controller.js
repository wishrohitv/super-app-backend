import { Product } from "../models/product.model.js";
import { PriceHistory } from "../models/pricehistory.model.js";
import mongoose from "mongoose";
import {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, currentPrice, category, subcategory } = req.body;
  if (
    [name, description, currentPrice, category, subcategory].some(
      (field) => !field || field === ""
    )
  ) {
    throw new BadRequestError(
      `All fields are required : name, description, currentPrice, category, subcategory`
    );
  }

  const product = await Product.create({
    name,
    description,
    currentPrice,
    category,
    subcategory,
  });

  if (!product) {
    throw new InternalServerError("Failed to create product");
  }

  // Add entry to price history
  const priceHistory = await PriceHistory.create({
    productId: product._id,
    price: currentPrice,
  });
  if (!priceHistory) {
    product.deleteOne(); // Rollback product creation
    throw new InternalServerError("Failed to create price history");
  }

  res.status(201).json(new SuccessResponse(201, product, "Product created"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, description, category, subcategory } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  // Update fields if provided
  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (subcategory) product.subcategory = subcategory;

  await product.save();
  res.status(200).json(new SuccessResponse(200, product, "Product updated"));
});

const updateProductPrice = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { newPrice } = req.body;

  if (!newPrice || newPrice <= 0) {
    throw new BadRequestError("New price must be a positive number");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  // Update fields if provided
  if (newPrice) product.currentPrice = newPrice;

  const updatedProduct = await product.save();
  console.log("Updated Product:", updatedProduct);
  console.log("Updated Product:", updatedProduct._id);
  console.log("Updated Product:", updatedProduct._id.toString());
  if (!updatedProduct) {
    throw new InternalServerError("Failed to update product price");
  }
  // Update previous price history entry to set endDate
  const updatePreviousPrice = await PriceHistory.findOneAndUpdate(
    {
      productId: new mongoose.Types.ObjectId(productId),
      endDate: { $type: "null" },
    },
    { endDate: new Date() },
    {
      returnDocument: "after",
    }
  );
  console.log("Updated Previous Price History:", updatePreviousPrice);
  if (!updatePreviousPrice) {
    // Rollback price update
    product.currentPrice = product.currentPrice; // Revert to old price
    await product.save();
    throw new InternalServerError("Failed to update previous price history");
  }
  // Create new price history entry for the new price
  const newPriceHistory = await PriceHistory.create({
    productId: product._id,
    price: newPrice,
  });
  if (!newPriceHistory) {
    // Rollback price update
    product.currentPrice = product.currentPrice; // Revert to old price
    await product.save();

    // Rollback previous price history update
    const updatePreviousPrice = await PriceHistory.findOneAndUpdate(
      {
        productId: new mongoose.Types.ObjectId(productId),
        createdAt: newPriceHistory.createdAt,
      },
      { endDate: { $type: "null" } },
      {
        returnDocument: "after",
      }
    );

    throw new InternalServerError("Failed to update product price history");
  }
  res
    .status(200)
    .json(new SuccessResponse(200, updatedProduct, "Product price updated"));
});

const getAllProducts = asyncHandler(async (req, res) => {});
const getProductById = asyncHandler(async (req, res) => {});
const deleteProduct = asyncHandler(async (req, res) => {});

const searchProducts = asyncHandler(async (req, res) => {});

export {
  createProduct,
  updateProduct,
  updateProductPrice,
  getAllProducts,
  getProductById,
  deleteProduct,
  searchProducts,
};
