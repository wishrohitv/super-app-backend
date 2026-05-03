import { Router } from "express";
import {
  userProfile,
  updateUserAvatar,
  updateUserProfile,
  updateUsername,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:username").get(userProfile);

// Update logged-in user's avatar image
router
  .route("/me/avatar")
  .put(verifyJWT, upload.single("avatarFiles"), updateUserAvatar);

// Update logged-in user's profile
router.route("/me/profile").put(verifyJWT, updateUserProfile);
// Update logged-in user's username
router.route("/me/username").put(verifyJWT, updateUsername);

export default router;
