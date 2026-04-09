import { Router } from "express";
import {
  userProfile,
} from "../controllers/users.controller.js";

const router = Router();

router.route("/:username").get(userProfile);

export default router;
