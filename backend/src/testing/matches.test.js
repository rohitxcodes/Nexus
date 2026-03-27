describe("Match API", () => {
  it("should create challenge", async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .post("/api/matches/challenge")
      .set("Cookie", token)
      .send({ opponentId: "dummyId" });

    expect(res.statusCode).toBeDefined();
  });
});
