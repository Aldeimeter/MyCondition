export interface ValidationError {
  field: string;
  message: string;
}

export interface Errors {
  [key: string]: string;
}

export interface ErrorResponse {
  message: string;
  validationErrors: ValidationError[];
}
