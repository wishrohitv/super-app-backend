import mongoose, { Schema } from "mongoose";

const reviewVoteSchema = new Schema({
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: "Review",
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  vote: {
    type: Number,
    enum: [1, -1], // 1 for upvote, -1 for downvote
    required: true,
  },
});

export const ReviewVote = mongoose.model("ReviewVote", reviewVoteSchema);
