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
      method: methodId || null,
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

export const getPaginatedWithQuery = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const skip = (page - 1) * limit;

    const { dateFrom, dateTo, methodId } = req.query;

    const queryBuilder = Weight.createQueryBuilder("weight")
      .leftJoinAndSelect("weight.method", "method") // Join the method table
      .addSelect("method.name", "methodName")
      .where("weight.user = :userId", { userId }) // Filter by the current user's ID
      .skip(skip)
      .take(limit);
    if (dateFrom) {
      queryBuilder.andWhere("weight.date >= :dateFrom", {
        dateFrom: dateFrom as string,
      });
    }

    if (dateTo) {
      queryBuilder.andWhere("weight.date <= :dateTo", {
        dateTo: dateTo as string,
      });
    }

    if (methodId === "null") {
      queryBuilder.andWhere("weight.methodId IS NULL");
    } else if (methodId) {
      queryBuilder.andWhere("weight.methodId = :methodId", {
        methodId: methodId as string,
      });
    }

    const [weights, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      queryBuilder.getCount(),
    ]);

    const measures = weights.entities.map((weight, index) => ({
      ...weight,
      method: weights.raw[index].methodName || null,
    }));

    res.status(200).json({
      success: true,
      measures: measures,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};
