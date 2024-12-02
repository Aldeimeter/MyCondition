const { body, param, query } = require("express-validator");
import Method from "@/components/measures/method/method.model";

export const createValidator = [
  body("date")
    .exists({ checkFalsy: true })
    .withMessage("Date is required")
    .isISO8601()
    .toDate()
    .withMessage("Date must be a valid ISO8601 format"),

  body("value")
    .exists({ checkFalsy: true })
    .withMessage("Value is required")
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive float"),

  body("methodId").custom(async (methodId: string | null) => {
    if (methodId === null || methodId === "") return true; // `null` is valid
    const methodExists = await Method.findOne({ where: { id: methodId } });
    if (!methodExists) {
      throw new Error("MethodId must exist in the methods table or be null");
    }
    return true;
  }),
];

export const removeValidator = [
  param("upperPreasureId")
    .notEmpty()
    .withMessage("Weight id is missing")
    .bail()
    .matches(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    )
    .withMessage("Id must be an UUID"),
];

export const getPaginatedWithQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer."),
  query("dateFrom")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("dateFrom must be a valid ISO 8601 date."),
  query("dateTo")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("dateTo must be a valid ISO 8601 date."),
  query("methodId")
    .optional()
    .custom(
      (value: string) =>
        value === "null" ||
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(
          value,
        ),
    )
    .withMessage("methodId must be 'null' or a valid UUID."),
];
