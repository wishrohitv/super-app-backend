import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new BadRequestError("Username, email, and password are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ConflictError(
      "User with the same username or email already exists"
    );
  }
  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  res
    .status(201)
    .json(
      new SuccessResponse(200, createdUser, "User registered successfully")
    );
});

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

export { registerUser, userProfile };
