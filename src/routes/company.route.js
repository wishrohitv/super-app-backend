import { Router } from "express";
import {
  createCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, upload.single("logoFiles"), createCompany);
router
  .route("/:companyId")
  .put(verifyJWT, upload.single("logoFiles"), updateCompany);

export default router;
