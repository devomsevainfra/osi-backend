import "dotenv/config";
import connectDB from "./db/connect.db.js";
import app from "./app.js";

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server running at port: ${process.env.PORT}`);
    });

    server.on("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });

    process.on("SIGINT", () => {
      console.log("Shutting down gracefully...");
      process.exit(0);
    });

  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
