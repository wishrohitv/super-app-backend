import { Router } from "express";

import {
  createProduct,
  updateProduct,
  updateProductPrice,
  getProductById,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createProduct);
router.route("/update/:productId").put(verifyJWT, updateProduct);
router.route("/update-price/:productId").put(verifyJWT, updateProductPrice);
router.route("/:productId").get(getProductById);

export default router;
