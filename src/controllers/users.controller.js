import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";

const tokenOptions = {
  samesite: false,
};

const userProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({
    username,
  }).select("-password -email");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res
    .status(200)
    .json(
      new SuccessResponse(200, user, "User profile retrieved successfully")
    );
});

export { userProfile };
