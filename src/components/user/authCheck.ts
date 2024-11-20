import jwt from "jsonwebtoken";
import { AuthorizationError } from "@config/errors";
import type { NextFunction, Response } from "express";
import type { AuthRequest, AuthJwtPayload } from "./interfaces";
import { ACCESS_TOKEN } from "./constants";

export const requireAuthentication = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AuthorizationError(
        "Authentication Error",
        undefined,
        "You are unauthenticated!",
        {
          error: "invalid_access_token",
          error_description: "unknown authentication scheme",
        },
      );
    }
    const aToken = authHeader.split(" ")[1];

    const decoded = jwt.verify(aToken, ACCESS_TOKEN.secret) as AuthJwtPayload;

    req.userId = decoded.id;
    req.token = aToken;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.error(err);

    const expParams = {
      error: "expired_access_token",
      error_description: "access token has expired",
    };

    if (err instanceof Error && err.name === "TokenExpiredError") {
      return next(
        new AuthorizationError(
          "Authentication Error",
          undefined,
          "Token lifetime exceeded!",
          expParams,
        ),
      );
    }

    next(err);
  }
};
