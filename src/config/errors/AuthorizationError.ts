import CustomError from "./CustomError";

type AuthParams = {
  realm?: string;
  [key: string]: string | undefined; // Allow dynamic key-value pairs
};

class AuthorizationError extends CustomError {
  authParams: AuthParams;
  authHeaders: Record<string, string>;

  /**
   * Authorization Error Constructor
   * @param {string} message - Error payload
   * @param {number} statusCode - Status code. Defaults to `401`
   * @param {string} feedback - Feedback message
   * @param {AuthParams} authParams - Authorization Parameters to set in `WWW-Authenticate` header
   */
  constructor(
    message: string,
    statusCode = 401,
    feedback = "",
    authParams: AuthParams = {},
  ) {
    super(message, statusCode, feedback); // Call parent constructor with args
    this.authParams = authParams;
    this.authHeaders = {
      "WWW-Authenticate": `Bearer ${this.#stringifyAuthParams()}`,
    };
    Object.setPrototypeOf(this, AuthorizationError.prototype); // Ensure correct prototype
  }

  // Private Method to convert object `key: value` to string `key=value`
  #stringifyAuthParams(): string {
    let str = "";
    let { realm, ...others } = this.authParams;

    // Default realm to "apps" if not provided
    realm = realm || "apps";
    str = `realm=${realm}`;

    const otherParams = Object.keys(others);
    if (otherParams.length < 1) return str;

    otherParams.forEach((authParam, index, array) => {
      // Delete other `realm(s)` if exists
      if (authParam.toLowerCase() === "realm") {
        delete others[authParam];
      }

      const comma = index === array.length - 1 ? "" : ",";

      str += ` ${authParam}=${this.authParams[authParam]}${comma}`;
    });

    return str;
  }
}

export default AuthorizationError;
