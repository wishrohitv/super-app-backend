import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  oAuthGoogle,
  oAuthCallback,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").get(refreshToken);
router.route("/oauth/google").get(oAuthGoogle);
router.route("/oauth/google/callback").get(oAuthCallback);
router.route("/get-user").get(verifyJWT, getCurrentUser);

export default router;
