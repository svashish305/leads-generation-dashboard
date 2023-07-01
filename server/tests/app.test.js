import request from "supertest";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupTestEnvironment, teardownTestEnvironment } from "../setupTest.js";
import routes from "../routes/index.js";

let app;
let server;

beforeAll(async () => {
  dotenv.config();
  await setupTestEnvironment();
  app = express();
  app.use(express.json());
  app.use(cors());
  app.use("/api/v1", routes);
  const port = process.env.PORT;
  server = app.listen(port);
});

afterAll(async () => {
  await teardownTestEnvironment();
  try {
    server.close();
  } catch (error) {
    console.error(error);
  }
});

describe("Server tests", () => {
  let authToken;
  let userId;

  describe("POST /api/v1/auth/signup", () => {
    it("should register a new user", async () => {
      const user = {
        name: "John Doe",
        email: "john.doe123@example.com",
        password: "password",
      };

      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(user);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("token");
      authToken = response.body.token;
      userId = response.body.userId;
    });

    it("should return an error when registering a user with an existing email", async () => {
      const user = {
        name: "Jane Smith",
        email: "john.doe123@example.com", // Existing email
        password: "password",
      };

      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(user)
        .expect(400);

      expect(response.body).toHaveProperty("message", "User already exists");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should log in a user with valid credentials", async () => {
      const user = {
        email: "john.doe123@example.com",
        password: "password",
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(user)
        .expect(200);

      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("token");
      authToken = response.body.token;
      userId = response.body.userId;
    });

    it("should return an error with invalid credentials", async () => {
      const user = {
        email: "john.doe123@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(user)
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid Credentials");
    });
  });

  describe("validateUser", () => {
    it("should return 401 if token is not provided", async () => {
      const response = await request(app).get("/api/v1/user").expect(401);

      expect(response.body).toHaveProperty("message", "Invalid User");
    });

    it("should return 401 if token is invalid or expired", async () => {
      const response = await request(app)
        .get("/api/v1/user")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body).toHaveProperty("message", "Invalid User");
    });

    it("should return 404 if user ID in URL does not match the token", async () => {
      const response = await request(app)
        .get(`/api/v1/user/100`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe("GET /api/v1/user/", () => {
    it("should retrieve the logged-in user", async () => {
      const response = await request(app)
        .get("/api/v1/user")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toBeDefined();
    });
  });

  describe("PATCH /api/v1/user/:userId", () => {
    it("should update the webhookUrl of a user", async () => {
      const payloadToUpdate = {
        webhookUrl: `api/v1/webhook/${userId}`,
      };

      const response = await request(app)
        .patch(`/api/v1/user/${userId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(payloadToUpdate)
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user.webhookUrl).toBe(payloadToUpdate.webhookUrl);
    });

    it("should not update the webhookUrl of a user if requested for another user", async () => {
      const payloadToUpdate = {
        webhookUrl: `api/v1/webhook/${userId}`,
      };

      const response = await request(app)
        .patch(`/api/v1/user/100`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(payloadToUpdate)
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("validateLead", () => {
    it("should return 400 if required fields are missing", async () => {
      const lead = {
        // Missing userId, name, email, and phone fields
      };

      const response = await request(app)
        .post("/api/v1/lead")
        .set("Authorization", `Bearer ${authToken}`)
        .send(lead)
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid Lead");
    });

    it("should return 400 if name is invalid", async () => {
      const lead = {
        userId,
        name: "12345", // Invalid name
      };

      const response = await request(app)
        .post("/api/v1/lead")
        .set("Authorization", `Bearer ${authToken}`)
        .send(lead)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("should return 400 if email is invalid", async () => {
      const lead = {
        userId,
        name: "Josh Doe",
        email: "invalid-email", // Invalid email format
      };

      const response = await request(app)
        .post("/api/v1/lead")
        .set("Authorization", `Bearer ${authToken}`)
        .send(lead)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("should return 400 if phone is invalid", async () => {
      const lead = {
        userId,
        name: "Josh Doe",
        email: "josh.doe@example.com",
        phone: "123", // Invalid phone format
      };

      const response = await request(app)
        .post("/api/v1/lead")
        .set("Authorization", `Bearer ${authToken}`)
        .send(lead)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("should format phone number and pass if it is valid", async () => {
      const lead = {
        userId,
        name: "Josh Doe",
        email: "josh.doe@example.com",
        phone: "+78 (800) 555-35-35",
      };

      const response = await request(app)
        .post("/api/v1/lead")
        .set("Authorization", `Bearer ${authToken}`)
        .send(lead)
        .expect(201);

      expect(response.body.lead.phone).toBe("+788005553535");
    });
  });

  describe("GET /api/v1/lead", () => {
    it("should retrieve paginated leads for a specific userId", async () => {
      const response = await request(app)
        .get("/api/v1/lead")
        .set("Authorization", `Bearer ${authToken}`)
        .query({
          userId,
          page: 1, // The page number you want to retrieve
          pageSize: 10, // The number of leads per page
          sortBy: "createdAt", // The field to sort by (e.g., createdAt)
          sortOrder: "desc", // The sort order (asc or desc)
        })
        .expect(200);

      expect(response.body).toHaveProperty("leads");
      expect(response.body).toHaveProperty("totalPages");

      const { leads, totalPages } = response.body;
      expect(Array.isArray(leads)).toBeTruthy();
      expect(totalPages).toBeGreaterThanOrEqual(0);
    });
  });
});
