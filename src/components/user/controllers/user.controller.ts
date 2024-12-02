import { CustomError } from "@config/errors";
import User from "../user.model";
import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../interfaces";
import { ROLES } from "../constants";
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

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password, age, height } = req.body;
    const newUser = new User({
      username,
      email,
      password,
      age,
      height,
    });
    await newUser.save();
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userToRemove = await User.findOneBy({
      id,
    });

    if (!userToRemove) {
      throw new CustomError("User not found", 404, "User does not exist");
    }
    await userToRemove.remove();

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

    const [users, total] = await Promise.all([
      User.find({ skip, take: limit, where: { role: ROLES.User } }),
      User.count(),
    ]);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const exportToCSV = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.findBy({ role: ROLES.User });

    const csvHeader = "email,username,password,age,height\n";
    const csvLines = [];
    for (const user of users) {
      csvLines.push(user.toCSV());
    }

    const csvData = csvHeader + csvLines.join("\n");
    res.status(200).json({ success: true, csv: csvData });
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
    const csvData = req.body.csv;

    if (!csvData) {
      res.status(400).json({ error: "CSV data is required." });
      return; // Return to avoid further execution
    }

    const users = [];
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Process each line in the CSV
    for (const [index, line] of csvData.split("\n").entries()) {
      // Skip empty lines
      if (!line.trim()) continue;

      const [email, username, password, age, height] = line.split(",");
      if (!email || !emailRegex.test(email)) {
        errors.push({ line: index + 1, error: "Invalid or missing email." });
        continue;
      }
      const userWithEmail = await User.findOneBy({ email });
      if (userWithEmail) {
        errors.push({ line: index + 1, error: "Email is already taken." });
        continue;
      }
      if (!username) {
        errors.push({ line: index + 1, error: "Missing username." });
        continue;
      }
      if (!password) {
        errors.push({ line: index + 1, error: "Missing password." });
        continue;
      }
      if (!age || isNaN(Number(age))) {
        errors.push({ line: index + 1, error: "Invalid or missing age." });
        continue;
      }
      if (!height || isNaN(Number(age))) {
        errors.push({ line: index + 1, error: "Invalid or missing height." });
        continue;
      }
      users.push(
        new User({
          email,
          username,
          password,
          age: Number(age),
          height: Number(height),
        }),
      );
    }

    await Promise.all(users.map((user) => user.save()));
    res
      .status(200)
      .json({ success: true, importedCount: users.length, errors });
  } catch (error) {
    next(error);
  }
};
