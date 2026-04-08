import { Router } from "express";
import { registerUser, userProfile } from "../controllers/users.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/:username").get(userProfile);
export default router;
