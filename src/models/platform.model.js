import { Schema } from "mongoose";

const platformSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
});

export const Platform = mongoose.model("Platform", platformSchema);
