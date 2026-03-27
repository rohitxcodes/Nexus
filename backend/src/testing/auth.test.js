const request = require("supertest");
const app = require("../app");

describe("Auth APIs", () => {
  it("should register user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "rohit",
      email: "rohit@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
  });

  it("should login user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "rohit@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
  });
});
