class CustomError extends Error {
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
    super(message);
    this.name = "CustomError";
    this.status = statusCode;
    this.cause = message;
    this.feedback = String(feedback); // Ensure feedback is always a string
    Object.setPrototypeOf(this, CustomError.prototype); // Fix inheritance issue
  }
}

export default CustomError;
