const request = require("supertest");
const app = require("../../app");

async function createUserAndLogin() {
  const user = {
    username: "testuser",
    email: "test@test.com",
    password: "123456",
  };

  await request(app).post("/api/auth/register").send(user);

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: user.password });

  const token = res.headers["set-cookie"][0].split(";")[0];

  return token;
}

module.exports = { createUserAndLogin };
