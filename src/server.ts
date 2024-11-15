import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import db from "./config/db.config";

// App initialization
const PORT = process.env.PORT || 8080;
const app = express();

// App middlewares
app.use(cors());
app.use(express.json());

// App routes
app.get("/health", async (_req: Request, res: Response) => {
  res.json({ data: "Server is running" });
});

// Error handling

// App boot
app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
db.initialize()
  .then(() => {
    console.log("---Database is connected---");
    app.emit("ready");
  })
  .catch((err) => {
    console.error("---Database connection error---", err);
  });
