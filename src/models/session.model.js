import mongoose from "mongoose";
import { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Session = mongoose.model("Session", sessionSchema);
