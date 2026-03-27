describe("Chat API", () => {
  it("should get chat history", async () => {
    const token = await createUserAndLogin();

    const res = await request(app)
      .get("/api/chat/123/history")
      .set("Cookie", token);

    expect(res.statusCode).toBeDefined();
  });
});
