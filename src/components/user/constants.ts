import type { CookieOptions } from "express";

export const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET as string,
  cookie: {
    name: "refresh_token",
    options: {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    } as unknown as CookieOptions,
  },
  expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY as string,
};

export const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET as string,
  expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY as string,
};

export enum ROLES {
  Admin = "admin",
  User = "user",
}
