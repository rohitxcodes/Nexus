const request = require("supertest");
const app = require("../app");
const { createUserAndLogin } = require("./utils/authHelper");

describe("Levels API", () => {
  it("should fetch levels", async () => {
    const token = await createUserAndLogin();

    const res = await request(app).get("/api/levels").set("Cookie", token);

    expect(res.statusCode).toBe(200);
  });
});
