import type { CorsOptions } from "cors";

const allowlist: string[] = ["http://localhost:3000", "http://localhost:8080"]; // Only specific origins if needed

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow requests without origin (like Postman) and from any origin for /api-docs
    if (!origin || allowlist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["WWW-Authenticate"],
};

export default corsOptions;
