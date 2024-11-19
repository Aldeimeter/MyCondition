import CustomError from "./CustomError";

class InternalError extends CustomError {
  status: number;
  cause: string;
  feedback: string;

  /**
   * Custom Error Constructor
   * @param {any} [message] - Optional error payload
   * @param {number} [statusCode] - Optional error HTTP status code
   * @param {string} [feedback=""] - Optional feedback message you want to provide
   */
  constructor(message: string, statusCode: number, feedback = "") {
    super(message, 500, "Internal Error");
    this.name = "CustomError";
    this.status = statusCode;
    this.cause = message;
    this.feedback = String(feedback); // Ensure feedback is always a string
    Object.setPrototypeOf(this, InternalError.prototype); // Fix inheritance issue
  }
}

export default InternalError;
