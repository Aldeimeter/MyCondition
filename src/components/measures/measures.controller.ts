import type { NextFunction, RequestHandler, Response } from "express";
import Weight from "./weight/weight.model";
import UpperPreasure from "./upperPreasure/upperPreasure.model";
import LowerPreasure from "./lowerPreasure/lowerPreasure.model";
import type { AuthRequest } from "@components/user/interfaces";
import Method from "./method/method.model";

export const importMeasures: RequestHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Explicitly return Promise<void>
  try {
    const csvData = req.body.csv; // Expecting raw CSV string in the request body
    if (!csvData) {
      res.status(400).json({ error: "CSV data is required." });
      return; // Return to avoid further execution
    }

    const measures = [];
    const errors = [];

    // Process each line in the CSV
    for (const [index, line] of csvData.split("\n").entries()) {
      // Skip empty lines
      if (!line.trim()) continue;

      const [date, value, type, methodId] = line.split(",");

      // Validate date and value
      if (!date || isNaN(new Date(date).getTime())) {
        errors.push({ line: index + 1, error: "Invalid or missing date." });
        continue;
      }
      if (!value || isNaN(parseFloat(value))) {
        errors.push({ line: index + 1, error: "Invalid or missing value." });
        continue;
      }

      // Validate methodId if provided
      if (methodId) {
        const method = await Method.findOne({ where: { id: methodId.trim() } });
        if (!method) {
          errors.push({
            line: index + 1,
            error: `Method with ID '${methodId.trim()}' not found.`,
          });
          continue;
        }
      }

      // Determine the type of measure and prepare for saving
      const trimmedType = type?.trim()?.toLowerCase();
      if (trimmedType === "weight") {
        measures.push(
          new Weight({
            date: date.trim(),
            value: parseFloat(value.trim()),
            method: methodId || undefined,
            user: req.userId,
          }),
        );
      } else if (trimmedType === "upper") {
        measures.push(
          new UpperPreasure({
            date: date.trim(),
            value: parseFloat(value.trim()),
            method: methodId || undefined,
            user: req.userId,
          }),
        );
      } else if (trimmedType === "lower") {
        measures.push(
          new LowerPreasure({
            date: date.trim(),
            value: parseFloat(value.trim()),
            method: methodId || undefined,
            user: req.userId,
          }),
        );
      } else {
        errors.push({
          line: index + 1,
          error: `Unsupported type '${type?.trim()}'.`,
        });
      }
    }

    // Save all valid measures to the database in bulk
    await Promise.all(measures.map((measure) => measure.save()));

    // Return success with any errors encountered
    res.status(201).json({
      success: true,
      importedCount: measures.length,
      errors,
    });
  } catch (error) {
    next(error);
  }
};

export const exportMeasures = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    // Fetch all measures for the authenticated user
    const weights = await Weight.find({ where: { user: userId } });
    const upperPressures = await UpperPreasure.find({
      where: { user: userId },
    });
    const lowerPressures = await LowerPreasure.find({
      where: { user: userId },
    });

    // Create CSV headers
    const headers = ["date", "value", "type", "methodId"].join(",");

    // Format data into CSV rows
    const weightRows = weights.map(
      (w) => `${w.date},${w.value},weight,${w.method ? w.method : ""}`,
    );
    const upperPressureRows = upperPressures.map(
      (u) => `${u.date},${u.value},upper,${u.method ? u.method : ""}`,
    );
    const lowerPressureRows = lowerPressures.map(
      (l) => `${l.date},${l.value},lower,${l.method ? l.method : ""}`,
    );

    // Combine all rows
    const csvData = [
      headers,
      ...weightRows,
      ...upperPressureRows,
      ...lowerPressureRows,
    ].join("\n");

    // Send the CSV data as JSON
    res.status(200).json({ success: true, csv: csvData });
  } catch (error) {
    next(error);
  }
};
