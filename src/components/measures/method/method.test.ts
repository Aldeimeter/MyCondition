import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import { createApp } from "@/app";
import request from "supertest";
import type { Express } from "express";
import AppDataSource from "@config/db";
import UserModel from "@components/user/user.model";
import MethodModel from "@components/measures/method/method.model";

describe("user API Tests", () => {
  const testUser = {
    username: "John",
    email: "john.doe@example.com",
    password: "john.doe.pass",
    age: 20,
    height: 12.2,
  };
  const testMethod = {
    name: "Method name",
    description: "Method description",
  };
  describe("POST /api/methods", () => {
    let app: Express;
    let accessToken: string;

    let methodId: string;

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
      await MethodModel.delete({ id: methodId });
      await AppDataSource.destroy();
    });

    test("Successful create", async () => {
      const response = await request(app)
        .post("/api/methods")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testMethod);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.method).toBeDefined();
      methodId = response.body.method.id;
    });
    test("Validation error: Name too short", async () => {
      const response = await request(app)
        .post("/api/methods")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ ...testMethod, name: "short" });

      expect(response.status).toBe(422);
    });
    test("Unauthorized", async () => {
      const response = await request(app).post("/api/methods").send(testMethod);

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
        .post("/api/methods")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testMethod);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: "Internal Server Error",
      });
      await AppDataSource.initialize();
    });
  });
  describe("DELETE /api/methods/{methodId}", () => {
    let app: Express;
    let accessToken: string;
    let methodId: string;

    beforeAll(async () => {
      app = await createApp();

      await UserModel.delete({ email: testUser.email });
      const user = new UserModel(testUser);
      await user.save();
      const method = new MethodModel(testMethod);
      await method.save();
      methodId = method.id;

      // Log in to get a valid access token
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

      accessToken = loginResponse.body.accessToken;
    });

    afterAll(async () => {
      await UserModel.delete({ email: testUser.email });
      await MethodModel.delete({ id: methodId });
      await AppDataSource.destroy();
    });

    test("Successful remove", async () => {
      const response = await request(app)
        .delete(`/api/methods/${methodId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    test("Method not found", async () => {
      const response = await request(app)
        .delete(`/api/methods/${methodId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
    test("Validation error: Invalid uuid", async () => {
      const response = await request(app)
        .delete(`/api/methods/f518ba11-ed51-41a4-954dc-37ddd24659f`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(422);
    });
    test("Unauthorized", async () => {
      const response = await request(app).delete(`/api/methods/${methodId}`);

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
        .delete(`/api/methods/${methodId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: "Internal Server Error",
      });
      await AppDataSource.initialize();
    });
  });
});
