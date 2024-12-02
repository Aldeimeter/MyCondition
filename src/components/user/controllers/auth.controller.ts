import jwt, { JsonWebTokenError } from "jsonwebtoken";
import crypto from "node:crypto";
import User from "../user.model";
import { CustomError, AuthorizationError } from "@config/errors";
import type { CookieOptions, NextFunction, Request, Response } from "express";
import type { AuthRequest, AuthJwtPayload } from "../interfaces";
import { REFRESH_TOKEN } from "../constants";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options,
    );
    res.json({ success: true, user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password, age, height } = req.body;
    const newUser = new User({
      username,
      email,
      password,
      age,
      height,
    });
    await newUser.save();
    const accessToken = newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options,
    );

    res.status(201).json({ success: true, user: newUser, accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const user = await User.findOneBy({ id: userId });

    if (!user) {
      return next(
        new CustomError("User not found", 404, "User does not exist"),
      );
    }

    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
    const refreshTokenHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");

    user.tokens = user.tokens?.filter(
      (tokenObj) => tokenObj.token !== refreshTokenHash,
    );

    await user.save();

    const expireCookieOptions: CookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        expires: new Date(Date.now() + 1),
        maxAge: 0,
      },
    );
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
    res.status(205).end();
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const user = await User.findOneBy({ id: userId });

    if (!user) {
      throw new CustomError("User not found", 404, "User does not exist");
    }
    user.tokens = [];
    await user.save();

    const expireCookieOptions: CookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        expires: new Date(Date.now() + 1),
        maxAge: 0,
      },
    );
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
    res.status(205).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

    if (!refreshToken) {
      throw new AuthorizationError(
        "Authentication Error",
        undefined,
        "You are unauthenticated!",
        {
          realm: "Obtain new Access Token",
          error: "no_rft",
          error_description: "Refresh token is missing",
        },
      );
    }

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      REFRESH_TOKEN.secret,
    ) as AuthJwtPayload;
    const refreshTokenHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");
    const userWithRefreshToken = await User.createQueryBuilder("user")
      .leftJoinAndSelect("user.tokens", "token")
      .where("user.id = :id", { id: decodedRefreshToken.id })
      .andWhere("token.token =:token", { token: refreshTokenHash })
      .getOne();

    if (!userWithRefreshToken) {
      throw new AuthorizationError(
        "Authentication Error",
        undefined,
        "You are unauthenticated!",
        {
          realm: "Obtain new Access Token",
        },
      );
    }

    const newAccessToken = userWithRefreshToken.generateAccessToken();

    res.status(201);
    res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });

    res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      const errorMessage = error.message || "Token Error";
      next(
        new AuthorizationError(
          errorMessage,
          undefined,
          "You are unauthenticated",
          {
            realm: "Obtain new Access Token",
            error_description: "token error",
          },
        ),
      );
      return;
    }
    next(error);
  }
};
