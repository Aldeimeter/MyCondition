import { CustomError } from "@config/errors";
import User from "../user.model";
import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../interfaces";
import { roles } from "../interfaces";
export const fetchUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    const retrievedUser = await User.findOneBy({ id: userId });
    if (!retrievedUser) {
      throw new CustomError(
        "User not found",
        404,
        `User with id ${userId} not found`,
      );
    }
    res.json({
      success: true,
      user: retrievedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAuthUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const user = await User.findOneBy({ id: userId });
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const exportToCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    const user = await User.findOneBy({ id: userId });

    if (!user) {
      throw new CustomError(
        "User not found",
        404,
        `User with id ${userId} not found`,
      );
    }
    if (user.role !== roles.Admin) {
      throw new CustomError("User is not an admin", 401);
    }

    const users = await User.findBy({ role: roles.User });

    const csvHeader = "email,username,password,dateOfBirth\n";
    const csvLines = [];
    for (const user of users) {
      csvLines.push(user.toCSV());
    }
    res.type("text/csv").send(csvHeader + csvLines.join("\n"));
  } catch (error) {
    next(error);
  }
};
export const importFromCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    const user = await User.findOneBy({ id: userId });

    if (!user) {
      throw new CustomError(
        "User not found",
        404,
        `User with id ${userId} not found`,
      );
    }
    if (user.role !== roles.Admin) {
      throw new CustomError("User is not an admin", 401);
    }

    const csv = req.body.csv;

    for (const line of csv.split("\n")) {
      if (line === "email,username,password,dateOfBirth") {
        continue;
      }
      const user = User.fromCSV(line);
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
