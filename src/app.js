import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGINS.split(","),
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Import routes
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

// Register routes
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", userRouter);

export default app;
