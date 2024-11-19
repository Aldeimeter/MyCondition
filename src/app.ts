import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import Config from "@/config";
import { LostErrorHandler, AppErrorHandler } from "./config/handlers/handler";
import type { Express, Request, Response } from "express";
export const createApp = async () => {
  // Init express app
  const app: Express = express();

  // App middlewares and customization
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.disable("x-powered-by");

  // App routes
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).send("Server is running");
  });

  app.use("/api", Config.routes);
  //App error handling
  //
  app.all("*", (_req, _res, next) => {
    next();
  });

  app.use(LostErrorHandler); // 404 error handler middleware
  app.use(AppErrorHandler); // General app error handler

  await Config.connectToDb().then(() => {
    console.log("---Database is connected---");
  });
  return app;
};
