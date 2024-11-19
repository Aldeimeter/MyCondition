import { CustomError } from "@config/errors";
import User from "../user.model";
import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../interfaces";
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
