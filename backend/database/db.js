import mongoose from "mongoose";

const connectDB = async () => {
  const DB_NAME = process.env.DB_NAME || "precogs-vuln-db";
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
