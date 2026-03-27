describe("Trophies API", () => {
  it("should get trophies", async () => {
    const token = await createUserAndLogin();

    const res = await request(app).get("/api/trophies").set("Cookie", token);

    expect(res.statusCode).toBe(200);
  });
});
