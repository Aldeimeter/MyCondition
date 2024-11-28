import type { NextFunction, Request, Response } from "express";
import Method from "./method.model";
import { CustomError } from "@config/errors";
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body;
    const newMethod = new Method({ name, description });
    await newMethod.save();

    res.status(201).json({ success: true, method: newMethod });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { methodId } = req.params;
    const methodToRemove = await Method.findOneBy({ id: methodId });
    if (!methodToRemove) {
      throw new CustomError("Method not found", 404, "Method does not exist");
    }
    methodToRemove.remove();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getPaginated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const skip = (page - 1) * limit;

    const [methods, total] = await Promise.all([
      Method.find({ skip, take: limit }), // Fetch methods
      Method.count(), // Count total methods
    ]);

    res.status(200).json({
      success: true,
      methods,
      totalPages: Math.ceil(total / limit), // Calculate total pages
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};
