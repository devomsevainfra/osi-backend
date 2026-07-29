import mongoose from "mongoose";
import * as AppConstants from "../constants/app.constants.js";
import Logger from "../utils/Logger.utils.js";

const connectDB = async () => {
  if (!AppConstants.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const connectionInstance = await mongoose.connect(AppConstants.MONGODB_URI, {
    dbName: AppConstants.DB_NAME,
  });

  Logger.log(
    `MongoDB connected with DB Host: ${connectionInstance.connection.host}`
  );
};

export default connectDB;
