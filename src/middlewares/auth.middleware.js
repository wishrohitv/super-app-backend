import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const _accessToken = req.cookies.accessToken;
  if (!_accessToken) {
    _accessToken = req.headers["x-access-token"];
  }
  if (!_accessToken) {
    throw new BadRequestError("Access token is required");
  }

  const decodedToken = jwt.verify(
    _accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (!decodedToken) {
    throw new BadRequestError("Invalid access token");
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
