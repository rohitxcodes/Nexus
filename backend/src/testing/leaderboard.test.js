describe("Leaderboard API", () => {
  it("should fetch leaderboard", async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .get("/api/leaderboard/overview")
      .set("Cookie", token);

    expect(res.statusCode).toBe(200);
  });
});
