jest.mock("../services/submission/submission.service.client");

const request = require("supertest");
const app = require("../app");
const { createUserAndLogin } = require("./utils/authHelper");

describe("Submission API", () => {
  it("should create submission", async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .post("/api/submissions")
      .set("Cookie", token)
      .send({
        levelNumber: 1,
        language: "javascript",
        code: "console.log(1)",
      });

    expect(res.statusCode).toBe(201);
  });
});
