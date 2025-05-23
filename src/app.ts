import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import Config from "@/config";
import { LostErrorHandler, AppErrorHandler } from "./config/handlers/handler";
import type { Express, NextFunction, Request, Response } from "express";
import path from "node:path";
import cors from "cors";
export const createApp = async () => {
  // Init express app
  const app: Express = express();

  // App middlewares and customization
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.disable("x-powered-by");

  if (process.env.NODE_ENV === "development") {
    console.log("Dev mode");
    app.use((req, _res, next) => {
      console.log(`Incoming request: ${req.method} ${req.url}`);
      next();
    });
    const { createProxyMiddleware } = await import("http-proxy-middleware");
    app.use(cors({ origin: "http://localhost:3000" }));

    app.use((req, res, next) => {
      if (!req.url.startsWith("/api")) {
        createProxyMiddleware({
          target: "http://localhost:3000",
          changeOrigin: true,
        })(req, res, next);
      } else {
        next();
      }
    });
  } else if (process.env.NODE_ENV !== "test") {
    // In production, serve React static files
    const reactBuildPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(reactBuildPath));

    // React routing - Handle unmatched routes
    app.get("*", (_req: Request, res: Response, next: NextFunction) => {
      try {
        res.sendFile(path.join(reactBuildPath, "index.html"));
      } catch (err) {
        next(err);
      }
    });
  }

  // App routes
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).send("Server is running");
  });

  app.use("/api", Config.routes);
  //App error handling

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
