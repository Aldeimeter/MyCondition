const { param, body, query } = require("express-validator");

export const removeMethodValidator = [
  param("methodId")
    .notEmpty()
    .withMessage("Method id is missing")
    .bail()
    .matches(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    )
    .withMessage("Id must be an UUID"),
];
export const createMethodValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[a-zA-Z0-9-\s]{8,48}$/)
    .withMessage("Name should be between 8 and 48 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];
export const getMethodsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer greater that or equal to 1")
    .toInt(),
  query("Limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be an integer greater that or equal to 1")
    .toInt(),
];
export const getMethodByQueryValidator = [
  query("q").trim().notEmpty().withMessage("Query is required"),
];
