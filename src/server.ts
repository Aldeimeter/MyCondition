import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ data: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on localhost:${PORT}`);
});
