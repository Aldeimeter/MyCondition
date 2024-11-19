import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import { createApp } from "@/app";
import request from "supertest";
import type { Express } from "express";
import AppDataSource from "@config/db";
import UserModel from "@components/user/user.model";

describe("user API Tests", () => {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0].replace(/-/g, " ");
  const testUser = {
    username: "John",
    email: "john.doe@example.com",
    password: "john.doe.pass",
    dateOfBirth: formattedDate,
    height: 12.2,
  };
  describe("GET /api/users/me", () => {
    let app: Express;
    let accessToken: string;

    beforeAll(async () => {
      app = await createApp();

      await UserModel.delete({ email: testUser.email });
      const user = new UserModel(testUser);
      await user.save();

      // Log in to get a valid access token
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

      accessToken = loginResponse.body.accessToken;
    });

    afterAll(async () => {
      await UserModel.delete({ email: testUser.email });
      await AppDataSource.destroy();
    });

    test("Successful fetch", async () => {
      const response = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    test("Unauthorized", async () => {
      const response = await request(app).get("/api/users/me");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: "Authentication Error",
        feedback: "You are unauthenticated!",
      });
    });
    test("Server error", async () => {
      // Simulate server error by temporarily disconnecting the database
      await AppDataSource.destroy();

      const response = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: "Internal Server Error",
      });
      await AppDataSource.initialize();
    });
  });
  describe("GET /api/users/{id}", () => {
    let app: Express;
    let accessToken: string;
    let userId: string;

    const testUser2 = {
      username: "Jane",
      email: "jane.doe@example.com",
      password: "jane.doe.pass",
      dateOfBirth: formattedDate,
      height: 12.2,
    };
    beforeAll(async () => {
      app = await createApp();
      await UserModel.delete({ email: testUser.email });
      await new UserModel(testUser).save();
      await UserModel.delete({ email: testUser2.email });
      const user = new UserModel(testUser2);
      await user.save();

      userId = user.id;
      // Log in to get a valid access token
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

      accessToken = loginResponse.body.accessToken;
    });

    afterAll(async () => {
      await UserModel.delete({ email: testUser.email });
      await UserModel.delete({ email: testUser2.email });
      await AppDataSource.destroy();
    });

    test("Successful fetch", async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    test("Validation error: Invalid id form", async () => {
      const response = await request(app)
        .get("/api/users/saddadd")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: "Validation error",
        validationErrors: [{ field: "id", message: "Id must be an UUID" }],
      });
    });

    test("User not found", async () => {
      const response = await request(app)
        .get("/api/users/d1ba12e2-da6b-40ba-a686-306c3a9d29e2")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
    test("Unauthorized", async () => {
      const response = await request(app).get(`/api/users/${userId}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: "Authentication Error",
        feedback: "You are unauthenticated!",
      });
    });
    test("Server error", async () => {
      // Simulate server error by temporarily disconnecting the database
      await AppDataSource.destroy();

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: "Internal Server Error",
      });
      await AppDataSource.initialize();
    });
  });
});
