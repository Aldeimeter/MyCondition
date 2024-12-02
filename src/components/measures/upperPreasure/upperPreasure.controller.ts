import type { NextFunction, Response } from "express";
import UpperPreasure from "./upperPreasure.model";
import { CustomError } from "@config/errors";
import type { AuthRequest } from "@components/user/interfaces";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { date, value, methodId } = req.body;
    const upperPreasure = new UpperPreasure({
      date,
      value,
      method: methodId || null,
      user: req.userId,
    });
    await upperPreasure.save();

    res.status(201).json({ success: true, measure: upperPreasure });
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
    const { upperPreasureId } = req.params;

    const measureToRemove = await UpperPreasure.findOneBy({
      id: upperPreasureId,
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

    const queryBuilder = UpperPreasure.createQueryBuilder("upperPreasure")
      .leftJoinAndSelect("upperPreasure.method", "method") // Join the method table
      .addSelect("method.name", "methodName")
      .where("upperPreasure.user = :userId", { userId }) // Filter by the current user's ID
      .skip(skip)
      .take(limit);
    if (dateFrom) {
      queryBuilder.andWhere("upperPreasure.date >= :dateFrom", {
        dateFrom: dateFrom as string,
      });
    }

    if (dateTo) {
      queryBuilder.andWhere("upperPreasure.date <= :dateTo", {
        dateTo: dateTo as string,
      });
    }

    if (methodId === "null") {
      queryBuilder.andWhere("upperPreasure.methodId IS NULL");
    } else if (methodId) {
      queryBuilder.andWhere("upperPreasure.methodId = :methodId", {
        methodId: methodId as string,
      });
    }

    const [upperPreasures, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      queryBuilder.getCount(),
    ]);

    const measures = upperPreasures.entities.map((upperPreasure, index) => ({
      ...upperPreasure,
      method: upperPreasures.raw[index].methodName || null,
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
