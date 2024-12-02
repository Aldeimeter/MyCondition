const { body } = require("express-validator");
import User from "../user.model";
import type { Request } from "express";

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .custom((value: string) => {
      if (value === "admin") {
        return true; // Allow "admin" as a valid email
      }
      if (!/\S+@\S+\.\S+/.test(value)) {
        throw new Error("Email is invalid");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required"),
];

export const signUpValidator = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .bail()
    .custom(async (email: string) => {
      try {
        // Check if email exists in the database
        const emailExists = await User.findOneBy({ email });
        if (emailExists) {
          throw new Error("E-mail already in use");
        }
      } catch (err) {
        if ((err as Error).message === "E-mail already in use") {
          throw new Error("E-mail already in use");
        }
        throw new Error("500");
      }
    }),
  body("age").trim().notEmpty().withMessage("Age is required"),
  body("height").trim().notEmpty().withMessage("Height is required"),
  body("password")
    .notEmpty()
    .withMessage("Password CANNOT be empty")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password MUST be at least 8 characters long"),
  body("passwordConfirm").custom((value: string, { req }: { req: Request }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords DO NOT match");
    }
    return true;
  }),
];
