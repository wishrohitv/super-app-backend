import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  oAuthGoogle,
  oAuthCallback,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").get(refreshToken);
router.route("/oauth/google").get(oAuthGoogle);
router.route("/oauth/google/callback").get(oAuthCallback);
export default router;
