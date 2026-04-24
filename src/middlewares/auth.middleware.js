import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UnauthorizedError, BadRequestError } from "../utils/AppErrors.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const _accessToken = req.cookies.accessToken;
  if (!_accessToken) {
    _accessToken = req.headers["x-access-token"];
  }
  if (!_accessToken) {
    throw new UnauthorizedError("Access token is required");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(_accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new UnauthorizedError(
      "Invalid expired access token, please login again"
    );
  }
  if (!decodedToken?._id) {
    throw new UnauthorizedError(
      "Invalid access token payload, please login again"
    );
  }

  const user = await User.findById(decodedToken._id).select("-password");

  if (!user) {
    throw new NotFoundError("User not found Invalid access token");
  }

  //   Check if the user is active or suspended or banned
  if (user.accountStatus === "suspended") {
    throw new BadRequestError("User account is suspended");
  }
  if (user.accountStatus === "banned") {
    throw new BadRequestError("User account is banned");
  }
  if (user.accountStatus === "deactivated") {
    throw new BadRequestError("User account is deactivated");
  }

  req.user = user;
  next();
});

export { verifyJWT };
