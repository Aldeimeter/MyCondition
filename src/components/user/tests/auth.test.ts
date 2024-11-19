import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import { createApp } from "@/app";
import request from "supertest";
import type { Express } from "express";
import AppDataSource from "@config/db";
import UserModel from "@components/user/user.model";

describe("Auth API Tests", () => {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0].replace(/-/g, " ");
  const testUser = {
    username: "John",
    email: "john.doe@example.com",
    password: "john.doe.pass",
    dateOfBirth: formattedDate,
    height: 12.2,
  };
  describe("POST /api/users/login", () => {
    let app: Express;

    beforeAll(async () => {
      app = await createApp();
      await UserModel.delete({ email: testUser.email });
      const user = new UserModel(testUser);
      await user.save();
    });

    afterAll(async () => {
      await UserModel.delete({ email: testUser.email });
    });

    test("Successful login", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.accessToken).toBeDefined();
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    test("Validation error: missing fields", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email }); // Missing password

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation error");
      expect(response.body.validationErrors).toBeInstanceOf(Array);
      expect(response.body.validationErrors).toHaveLength(1);
      expect(response.body.validationErrors[0]).toEqual({
        field: "password",
        message: "Password is required",
      });
    });

    test("Wrong credentials", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: "wrong.password" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Wrong credentials");
      expect(response.body.feedback).toBe("Email or password is wrong!");
    });

    test("Server error", async () => {
      // Simulate server error by temporarily disconnecting the database
      await AppDataSource.destroy();

      const response = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");

      // Reconnect the database for subsequent tests
      await AppDataSource.initialize();
    });
  });
  describe("POST /api/users/signup", () => {
    let app: Express;
    const testUserSignup = { passwordConfirm: testUser.password, ...testUser };
    beforeAll(async () => {
      app = await createApp();
    });

    afterAll(async () => {
      await UserModel.delete({ email: testUser.email });
    });

    test("Successful registration", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(testUserSignup);
      expect(response.status).toBe(201);
      expect(response.body.accessToken).toBeDefined();
      expect(response.headers["set-cookie"]).toBeDefined();
      await UserModel.delete({ email: testUser.email });
    });

    test("Validation error: missing fields", async () => {
      const incompleteUser = {
        username: "Jane",
        email: "jane.smith@example.com",
        passwordConfirm: "jane.smith.pass",
      };

      const response = await request(app)
        .post("/api/users/signup")
        .send(incompleteUser);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation error");
      expect(response.body.validationErrors).toBeInstanceOf(Array);
    });

    test("Validation error: email already in use", async () => {
      const user = new UserModel(testUser);
      await user.save();
      const response = await request(app)
        .post("/api/users/signup")
        .send(testUserSignup);

      expect(response.status).toBe(422);
      expect(response.body.error).toBe("Validation error");
      expect(response.body.validationErrors).toBeInstanceOf(Array);
      expect(response.body.validationErrors[0]).toEqual({
        field: "email",
        message: "E-mail already in use",
      });
    });

    test("Server error", async () => {
      // Simulate server error by temporarily disconnecting the database
      await AppDataSource.destroy();

      const response = await request(app)
        .post("/api/users/signup")
        .send(testUser);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Internal Server Error");

      // Reconnect the database for subsequent tests
      await AppDataSource.initialize();
    });
  });
  describe("POST /api/users/logout", () => {
    let app: Express;
    let accessToken: string;
    let cookies: string;

    beforeAll(async () => {
      app = await createApp();

      // Set up the test user
      await UserModel.delete({ email: testUser.email });
      const user = new UserModel(testUser);
      await user.save();

      // Log in to get a valid access token and cookies
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

      accessToken = loginResponse.body.accessToken;
      cookies = loginResponse.headers["set-cookie"];
    });

    afterAll(async () => {
      await UserModel.delete({ email: testUser.email });
      await AppDataSource.destroy();
    });

    test("Successful logout", async () => {
      const response = await request(app)
        .post("/api/users/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(205);
      expect(response.headers).toHaveProperty("set-cookie");
      expect(response.headers).toHaveProperty("date");
      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringMatching(
            `refresh_token=; Max-Age=0; Path=/; Expires=${response.headers["date"]}; HttpOnly; Secure; SameSite=None`,
          ),
        ]),
      );
    });

    test("Unauthorized logout (missing token)", async () => {
      const response = await request(app).post("/api/users/logout");

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: "Authentication Error",
        feedback: "You are unauthenticated!",
      });
    });

    test("Server error", async () => {
      // Simulate server error by temporarily disconnecting the database
      await AppDataSource.destroy();

      const response = await request(app)
        .post("/api/users/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: "Internal Server Error",
      });

      // Reconnect the database for subsequent tests
      await AppDataSource.initialize();
    });
  });
  describe("POST /api/users/master-logout", () => {
    let app: Express;
    let accessToken: string;
    let cookies: string;

    beforeAll(async () => {
      app = await createApp();

      // Set up the test user
      await UserModel.delete({ email: testUser.email });
      const user = new UserModel(testUser);
      await user.save();

      // Log in to get a valid access token and cookies
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

      accessToken = loginResponse.body.accessToken;
      cookies = loginResponse.headers["set-cookie"];
    });

    afterAll(async () => {
      await UserModel.delete({ email: testUser.email });
      await AppDataSource.destroy();
    });

    test("Successful logout", async () => {
      const response = await request(app)
        .post("/api/users/master-logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(205);
      expect(response.headers).toHaveProperty("set-cookie");
      expect(response.headers).toHaveProperty("date");
      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringMatching(
            `refresh_token=; Max-Age=0; Path=/; Expires=${response.headers["date"]}; HttpOnly; Secure; SameSite=None`,
          ),
        ]),
      );
    });

    test("Unauthorized logout (missing token)", async () => {
      const response = await request(app).post("/api/users/master-logout");

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: "Authentication Error",
        feedback: "You are unauthenticated!",
      });
    });

    test("Server error", async () => {
      // Simulate server error by temporarily disconnecting the database
      await AppDataSource.destroy();

      const response = await request(app)
        .post("/api/users/master-logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: "Internal Server Error",
      });

      // Reconnect the database for subsequent tests
      await AppDataSource.initialize();
    });
  });
  describe("POST /api/users/reauth", () => {
    let app: Express;
    let accessToken: string;
    let cookies: string;

    beforeAll(async () => {
      app = await createApp();

      // Set up the test user
      await UserModel.delete({ email: testUser.email });
      const user = new UserModel(testUser);
      await user.save();

      // Log in to get a valid access token and cookies
      const loginResponse = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

      accessToken = loginResponse.body.accessToken;
      cookies = loginResponse.headers["set-cookie"];
    });

    afterAll(async () => {
      await UserModel.delete({ email: testUser.email });
    });

    test("Successful reauth", async () => {
      const response = await request(app)
        .post("/api/users/reauth")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("accessToken");
    });

    test("Unauthorized reauth (missing cookie token)", async () => {
      const response = await request(app).post("/api/users/reauth");

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: "Authentication Error",
        feedback: "You are unauthenticated!",
      });
    });

    test("Server error", async () => {
      // Simulate server error by temporarily disconnecting the database
      await AppDataSource.destroy();

      const response = await request(app)
        .post("/api/users/reauth")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({
        error: "Internal Server Error",
      });

      // Reconnect the database for subsequent tests
      await AppDataSource.initialize();
    });
  });
});
