import type { Request, Response, NextFunction } from "express";
const { validationResult } = require("express-validator");

export default (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next(); // No errors, continue to the next middleware
  }

  // Extract internal errors (e.g., database errors marked with msg === "500")
  const internalErrors = errors
    .array()
    .filter((err: { msg: string }) => err.msg === "500");

  if (internalErrors.length > 0) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  } else {
    // Handle validation errors
    const extractedErrors = errors
      .array()
      .map((err: { path: string; msg: string }) => ({
        field: err.path, // Correct property is `param` not `path`
        message: err.msg,
      }));

    res.status(422).json({
      error: "Validation error",
      validationErrors: extractedErrors,
    });
  }
};
