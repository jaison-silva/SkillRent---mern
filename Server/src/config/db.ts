import mongoose from "mongoose";

const connectDB = async function () {
  try {

    if (!process.env.MONGO_URI) {
      console.error("No mongodv uri is defined");
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI!)
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(`DB connection error : ${err}`);
    process.exit(1);
  }
}

export default connectDB