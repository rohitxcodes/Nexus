describe("XP API", () => {
  it("should record xp", async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .post("/api/xp/record")
      .set("Cookie", token)
      .send({ levelNumber: 1, amount: 30 });

    expect(res.statusCode).toBe(200);
  });
});
