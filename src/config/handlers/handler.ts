import type { Request, Response, NextFunction } from "express";
import type { CustomError } from "@config/errors";
import { AuthorizationError } from "@config/errors";

// 404 Error Handler
function LostErrorHandler(
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  res.status(404).json({
    error: "Resource not found",
  });
}

// Exception Handler
function AppErrorHandler(
  err: CustomError, // Using CustomError type for better type checking
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.status || 500;
  res.status(statusCode);
  if (statusCode === 500) {
    console.error(err);
    res.json({ error: "Internal Server Error" });
    return;
  }

  if (err instanceof AuthorizationError) {
    // Sets headers available in Authorization Error object
    res.set(err.authHeaders);
  }
  // `cause` is a custom property on the error object
  const error = err?.cause || err?.message;
  const providedFeedback = err?.feedback;

  // Respond with error and conditionally include feedback if provided
  res.json({
    error,
    ...(providedFeedback && { feedback: providedFeedback }),
  });
}

export { LostErrorHandler, AppErrorHandler };
