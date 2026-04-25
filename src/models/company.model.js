import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
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
  email: {
    type: String,
  },
  logo: {
    public_id: String,
    secure_url: String,
  },
  website: {
    type: String,
  },
});

export const Company = mongoose.model("Company", companySchema);
