import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { ROLES } from "./constants";
// Extend Express's Request type to include custom properties
export interface AuthRequest extends Request {
  userId?: string;
  token?: string;
  role?: ROLES;
}
// Define a custom JWT payload type
export interface AuthJwtPayload extends JwtPayload {
  id: string;
  role: ROLES;
}
