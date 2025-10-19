import { configDotenv } from "dotenv";

configDotenv();

import mongoose from "mongoose";

const DB_CONNECT_STRING = process.env.DB_CONNECT_STRING;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB_CONNECT_STRING);
    
    console.log("💻 MongoDB Connected");
  } catch (err) {

    console.error("❌ MongoDB connection error:", err);
  }
};
