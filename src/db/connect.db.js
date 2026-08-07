import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) 
    throw new Error("MONGODB_URI is not defined in environment variables");

  const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  });

  console.log(
    `MongoDB connected with DB Host: ${connectionInstance.connection.host}:${connectionInstance.connection.port}`
  );
};

export default connectDB;
