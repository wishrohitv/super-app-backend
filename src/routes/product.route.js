import { Router } from "express";

import {
  createProduct,
  updateProduct,
  updateProductPrice,
  getProductById,
} from "../controllers/product.controller.js";
import {
  createBuyLink,
  updateBuyLink,
} from "../controllers/buylink.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, upload.array("productFiles", 5), createProduct);
router.route("/:productId").patch(verifyJWT, upload.none(), updateProduct);
router
  .route("/:productId/price")
  .patch(verifyJWT, upload.none(), updateProductPrice);
router.route("/:productId").get(getProductById, upload.none());

// Buy link route
router
  .route("/:productId/buylinks")
  .post(verifyJWT, upload.none(), createBuyLink);
router
  .route("/:productId/buylinks/:buyLinkId")
  .patch(verifyJWT, upload.none(), updateBuyLink);

export default router;
