import { Product } from "../models/product.model.js";
import { PriceHistory } from "../models/pricehistory.model.js";
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
const getAllProducts = asyncHandler(async (req, res) => {});
const getProductById = asyncHandler(async (req, res) => {});
const updateProduct = asyncHandler(async (req, res) => {});
const deleteProduct = asyncHandler(async (req, res) => {});

const searchProducts = asyncHandler(async (req, res) => {});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};
