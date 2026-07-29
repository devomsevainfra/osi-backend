import dotenv from "dotenv/config";
import connectDB from "./db/connect.db.js";
import app from "./app.js";
import * as AppConstants from "./constants/app.constants.js";
import Logger from "./utils/Logger.utils.js";

console.log(`Staring Apllication`);


connectDB()
  .then(() => {
    const server = app.listen(AppConstants.PORT, () => {
      Logger.log(`Server running at port: ${AppConstants.PORT}`);
    });

    server.on("error", (err) => {
      Logger.error("Server error:", err);
      process.exit(1);
    });

    process.on("SIGINT", () => {
      Logger.log("Shutting down gracefully...");
      process.exit(0);
    });
  })
  .catch((error) => {
    Logger.error("MongoDB connection failed:", error);
    process.exit(1);
  });
