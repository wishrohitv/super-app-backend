import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";
import { uploadFile, deleteFile } from "../services/cloudinary.js";

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

const updateUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const avatarFiles = req.file;

  if (!avatarFiles) {
    throw new BadRequestError("No avatar file uploaded");
  }

  let uploadResult;
  try {
    uploadResult = await uploadFile(avatarFiles.path);
  } catch (error) {
    throw new InternalServerError("Failed to upload avatar, please try again");
  }

  const user = await User.findById(userId);

  if (!user) {
    // Clean up the uploaded file if user not found
    await deleteFile(uploadResult.public_id);
    throw new NotFoundError("User not found");
  }

  // If user already has an avatar, delete the old one from Cloudinary
  if (user.avatar && user.avatar.public_id) {
    await deleteFile(user.avatar.public_id);
  }

  user.avatar = {
    public_id: uploadResult.public_id,
    url: uploadResult.secure_url,
  };
  await user.save();

  res
    .status(200)
    .json(new SuccessResponse(200, user.avatar, "Avatar updated successfully"));
});

const deleteUserAvatar = asyncHandler(async (req, res) => {});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const existingUsername = req.user.username;
  const { name } = req.body;

  if (!name || existingUsername.trim() === name) {
    throw new BadRequestError("Name is required");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.name = name || user.name;
  await user.save();

  res
    .status(200)
    .json(new SuccessResponse(200, user, "User profile updated successfully"));
});

const updateUserEmail = asyncHandler(async (req, res) => {});

const updateUserPassword = asyncHandler(async (req, res) => {});

const updateUsername = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { username } = req.body;

  if (!username) {
    throw new BadRequestError("Username is required");
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  const usernameTaken = await User.findOne({
    username,
  });
  if (usernameTaken) {
    throw new ConflictError("Username is already taken");
  }

  existingUser.username = username;
  await existingUser.save();

  res
    .status(200)
    .json(
      new SuccessResponse(200, existingUser, "Username updated successfully")
    );
});

export {
  userProfile,
  updateUserAvatar,
  deleteUserAvatar,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  updateUsername,
};
