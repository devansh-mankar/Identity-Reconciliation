import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      error: err.message,
    });
  }

  if ((err as any).code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "Duplicate key error",
      error: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};
