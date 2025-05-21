import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./utils/logger";
import { apiRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import path from "path";

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/identity-reconciliation";
    await mongoose.connect(mongoURI);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

startServer();

export default app;
