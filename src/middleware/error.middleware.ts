import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  // Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        details: Object.values(err.errors).map((validationError) => ({
          field: validationError.path,
          message: validationError.message,
        })),
      },
    });
    return;
  }

  // Invalid MongoDB ObjectId
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      error: {
        message: "Invalid resource ID",
      },
    });
    return;
  }

  // Unexpected server errors
  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
    },
  });
}