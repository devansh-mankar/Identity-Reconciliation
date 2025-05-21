import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./utils/logger";
import { apiRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.use(errorHandler);

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

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
};

process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

startServer();

export default app;
