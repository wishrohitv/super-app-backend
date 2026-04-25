import { Router } from "express";
import {
  userProfile,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:username").get(userProfile);
router
  .route("/update-avatar")
  .put(verifyJWT, upload.single("avatarFiles"), updateUserAvatar);
router.route("/update-profile").put(verifyJWT, updateUserProfile);

export default router;
