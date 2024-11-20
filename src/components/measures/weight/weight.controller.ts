import type { NextFunction, Request, Response } from "express";
import Weight from "./weight.model";
import { CustomError } from "@config/errors";
import type { AuthRequest } from "@components/user/interfaces";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { date, value, methodId } = req.body;
    const weight = new Weight({
      date,
      value,
      method: methodId,
      user: req.userId,
    });
    await weight.save();

    res.status(201).json({ success: true, measure: weight });
  } catch (error) {
    next(error);
  }
};
export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { weightId } = req.params;
    const weightToRemove = await Weight.findOneBy({
      id: weightId,
      user: req.userId,
    });
    if (!weightToRemove) {
      throw new CustomError(
        "Weight measure not found",
        404,
        "Weight measure does not exist",
      );
    }
    weightToRemove.remove();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getAllWithQuery = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { from, to, methodId } = req.query;

    // Base query with user filter
    const query = Weight.createQueryBuilder("weight").where(
      "weight.user = :user",
      {
        user: req.userId,
      },
    );

    // Add optional filters if provided
    if (from) {
      query.andWhere("weight.date >= :from", { from });
    }

    if (to) {
      query.andWhere("weight.date <= :to", { to });
    }

    if (methodId) {
      query.andWhere("weight.methodId = :methodId", { methodId });
    }

    const weightsToReturn = await query.getMany();

    res.status(200).json({ success: true, measures: weightsToReturn });
  } catch (error) {
    next(error);
  }
};
