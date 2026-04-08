import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DATABASE_NAME}`
    );
    console.log(`DATABASE CONNECTED SUCCESSFULLY: ${conn.connection.host}`);
  } catch (error) {
    console.log("DATABASE CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default connectDatabase;
