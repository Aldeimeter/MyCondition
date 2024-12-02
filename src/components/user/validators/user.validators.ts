const { param, query } = require("express-validator");

export const fetchUserProfileValidator = [
  param("id")
    .notEmpty()
    .withMessage("User id is missing")
    .bail()
    .matches(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    )
    .withMessage("Id must be an UUID"),
];
export const getPaginatedValidator = [
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
