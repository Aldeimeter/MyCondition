export interface ValidationError {
  field: string;
  message: string;
}

export interface Errors {
  [key: string]: string;
}

export interface ValidationErrorResponse {
  message: string;
  validationErrors: ValidationError[];
}
export interface ErrorResponse {
  feedback: string;
  error: string;
}
