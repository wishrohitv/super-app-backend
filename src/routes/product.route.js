import { Router } from "express";

import {
  createProduct,
  updateProduct,
  updateProductPrice,
  getProductById,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, upload.array("productFiles", 5), createProduct);
router.route("/update/:productId").put(verifyJWT, upload.none(), updateProduct);
router
  .route("/:productId/price")
  .put(verifyJWT, upload.none(), updateProductPrice);
router.route("/:productId").get(getProductById, upload.none());

export default router;
