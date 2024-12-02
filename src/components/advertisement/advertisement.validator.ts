const { param, body, query } = require("express-validator");

export const modifyAdvertisementValidator = [
  param("adId")
    .notEmpty()
    .withMessage("Advertisement id is missing")
    .bail()
    .matches(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    )
    .withMessage("Id must be an UUID"),
];

export const createAdvertisementValidator = [
  body("imgUrl")
    .trim()
    .notEmpty()
    .withMessage("Image URL is required")
    .bail()
    .isURL()
    .withMessage("Image URL must be a valid URL")
    .isLength({ max: 2048 })
    .withMessage("Image URL cannot exceed 2048 characters"),
  body("targetUrl")
    .trim()
    .notEmpty()
    .withMessage("Target URL is required")
    .bail()
    .isURL()
    .withMessage("Target URL must be a valid URL")
    .isLength({ max: 2048 })
    .withMessage("Target URL cannot exceed 2048 characters"),
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
