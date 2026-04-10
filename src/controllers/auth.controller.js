import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { google } from "googleapis";
import crypto from "crypto";
import url from "url";
import jwt from "jsonwebtoken";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../utils/AppErrors.js";
import { SuccessResponse } from "../utils/AppResponse.js";

const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
let userCredential = null;

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

async function generateAccessAndRefreshToken(userId) {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    const session = await Session.create({
      userId: userId,
      refreshToken,
    });

    if (!session) {
      throw new InternalServerError("Failed to create session for the user");
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new InternalServerError("Failed to generate tokens");
  }
}

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isPasswordMatched = await user.isPasswordMatch(password);

  if (!isPasswordMatched) {
    throw new BadRequestError("Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new SuccessResponse(
        200,
        {
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
        },
        "User logged in successfully"
      )
    );
});

const refreshToken = asyncHandler(async (req, res) => {
  const _refreshToken = req.cookies.refreshToken;
  if (!_refreshToken) {
    _refreshToken = req.headers["x-refresh-token"];
  }
  if (!_refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  const decodedToken = jwt.verify(
    _refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!decodedToken) {
    throw new BadRequestError("Invalid refresh token");
  }

  const session = await Session.findOne({ refreshToken: _refreshToken });

  if (_refreshToken !== session?.refreshToken) {
    throw new BadRequestError("Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    session?.userId
  );
  const removeOldSession = await Session.findByIdAndDelete(session?._id);
  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(new SuccessResponse(200, null, "Token refreshed successfully"));
});

const oAuthGoogle = asyncHandler(async (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const state = crypto.randomBytes(32).toString("hex");

  // Store state in the session
  req.session.state = state;

  // Generate a url that asks permissions for the Drive activity and Google Calendar scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
    state: state,
  });

  res.redirect(authorizationUrl);
});

const oAuthCallback = asyncHandler(async (req, res) => {
  const redirectUri = `${req.protocol}://${req.host}${req.originalUrl}`;

  // Handle the OAuth 2.0 server response
  let q = url.parse(req.url, true).query;

  let _oauth2Client = new google.auth.OAuth2(); // create new auth client
  if (q.error) {
    // An error response e.g. error=access_denied
    console.log("Error:" + q.error);
    throw new BadRequestError("Error: " + q.error);
  } else if (q.state !== req.session.state) {
    //check state value
    console.log("State mismatch. Possible CSRF attack");
    throw new BadRequestError("State mismatch. Possible CSRF attack");
  } else {
    // Get access and refresh tokens (if access_type is offline)
    let { tokens } = await oauth2Client.getToken(q.code);

    _oauth2Client.setCredentials(tokens);
  }

  let oauth2 = google.oauth2({
    auth: _oauth2Client,
    version: "v2",
  });
  let { data } = await oauth2.userinfo.get(); // get user info
  // you will find name, email, picture etc. here

  /*
  {
  id: '11*************3',
  email: 'gaienevemd@gmail.com',
  verified_email: true,
  name: 'Lenovo ThinkPad',
  given_name: 'Lenovo',
  family_name: 'ThinkPad',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocLYV8eurnurHO71C9R9VKyQCIDL8t7H1HFiDwdga2vMaIOjjA=s96-c'
}
  */
  let counter = 0;
  let proposedUsername = `${data.given_name}_${data.family_name}`;

  let existingUser = await User.findOne({
    email: data.email,
  });

  if (!existingUser) {
    while (true) {
      const existingUsername = await User.findOne({
        username: proposedUsername,
      });

      if (existingUsername) {
        proposedUsername = `${data.given_name}_${data.family_name}_${counter}`;
        counter++;
      } else {
        break;
      }
    }
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      username: proposedUsername,
      provider: "google",
      isVerified: data.verified_email,
      avatar: {
        url: data.picture,
        public_id: null,
      },
    });
    existingUser = newUser;
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser._id
  );

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .redirect(process.env.GOOGLE_OAUTH_REDIRECT_AFTER_SIGNIN_URI);
});

export { registerUser, loginUser, refreshToken, oAuthGoogle, oAuthCallback };
