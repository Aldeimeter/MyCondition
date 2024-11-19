const { param } = require("express-validator");

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
