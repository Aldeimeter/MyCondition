import "reflect-metadata";
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "chat-app",
  synchronize: true, // Set to false in production; use migrations instead
  logging: false,
  entities: ["src/**/*.model.ts"], // Path to your entities
  migrations: [], // Path to your migrations
  subscribers: [], // Optional
  schema: "public",
});

export const connectToDb = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection established");
    } else {
      console.log("Database is already connected");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Database connection failed:", err.message);
    }
    throw err;
  }
};

export default AppDataSource;
