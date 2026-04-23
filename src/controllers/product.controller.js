import { Product } from "../models/product.model.js";
import {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, subcategory } = req.body;
  if (
    [name, description, price, category, subcategory].some(
      (field) => !field || field === ""
    )
  ) {
    throw new BadRequestError(
      `All fields are required : name, description, price, category, subcategory`
    );
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    subcategory,
  });

  if (!product) {
    throw new InternalServerError("Failed to create product");
  }
  res.status(201).json(new SuccessResponse("Product created", product));
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
