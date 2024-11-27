import { ValidationError, Errors } from "./interfaces";
export const mapValidationErrors = (
  serverErrors: ValidationError[],
): Errors => {
  const errorMap: Errors = {};
  serverErrors.forEach((error) => {
    errorMap[error.field] = error.message;
  });
  return errorMap;
};
