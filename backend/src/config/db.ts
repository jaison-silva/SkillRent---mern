import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async function () {
  try {
    if (!process.env.MONGO_URI) {
      logger.error("No mongodb uri is defined");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI!)
    logger.info("✅ Database connected successfully");
  } catch (err) {
    logger.error(`DB connection error : ${err}`);
    process.exit(1);
  }
}

export default connectDB