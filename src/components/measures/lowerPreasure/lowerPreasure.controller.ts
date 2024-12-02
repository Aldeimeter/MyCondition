import type { NextFunction, Response } from "express";
import LowerPreasure from "./lowerPreasure.model";
import { CustomError } from "@config/errors";
import type { AuthRequest } from "@components/user/interfaces";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { date, value, methodId } = req.body;
    const lowerPreasure = new LowerPreasure({
      date,
      value,
      method: methodId || null,
      user: req.userId,
    });
    await lowerPreasure.save();

    res.status(201).json({ success: true, measure: lowerPreasure });
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
    const { lowerPreasureId } = req.params;

    const measureToRemove = await LowerPreasure.findOneBy({
      id: lowerPreasureId,
      user: req.userId,
    });

    if (!measureToRemove) {
      throw new CustomError(
        "Weight measure not found",
        404,
        "Weight measure does not exist",
      );
    }
    await measureToRemove.remove();

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

    const queryBuilder = LowerPreasure.createQueryBuilder("lowerPreasure")
      .leftJoinAndSelect("lowerPreasure.method", "method") // Join the method table
      .addSelect("method.name", "methodName")
      .where("lowerPreasure.user = :userId", { userId }) // Filter by the current user's ID
      .skip(skip)
      .take(limit);
    if (dateFrom) {
      queryBuilder.andWhere("lowerPreasure.date >= :dateFrom", {
        dateFrom: dateFrom as string,
      });
    }

    if (dateTo) {
      queryBuilder.andWhere("lowerPreasure.date <= :dateTo", {
        dateTo: dateTo as string,
      });
    }

    if (methodId === "null") {
      queryBuilder.andWhere("lowerPreasure.methodId IS NULL");
    } else if (methodId) {
      queryBuilder.andWhere("lowerPreasure.methodId = :methodId", {
        methodId: methodId as string,
      });
    }

    const [lowerPreasures, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      queryBuilder.getCount(),
    ]);

    const measures = lowerPreasures.entities.map((lowerPreasure, index) => ({
      ...lowerPreasure,
      method: lowerPreasures.raw[index].methodName || null,
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
