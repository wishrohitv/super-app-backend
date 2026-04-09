import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { google } from "googleapis";
import crypto from "crypto";
import url from "url";

const redirectUri = `http://localhost:4000/api/v1/auth/oauth/google/callback`;

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
let userCredential = null;

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

  const isPasswordMatched = await User.isPasswordMatch(password);

  if (!isPasswordMatched) {
    throw new BadRequestError("Invalid password");
  }
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
  console.log(data); // you will find name, email, picture etc. here

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ConflictError(
      "User with the same username or email already exists"
    );
  }

  res.redirect("http://localhost:8000/auth/success");
});

export { registerUser, loginUser, oAuthGoogle, oAuthCallback };
