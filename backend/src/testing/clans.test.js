describe("Clan API", () => {
  it("should create clan", async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .post("/api/clans")
      .set("Cookie", token)
      .send({ name: "Alpha", description: "test" });

    expect(res.statusCode).toBe(201);
  });
});
