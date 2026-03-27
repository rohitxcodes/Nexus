describe("Shop API", () => {
  it("should fetch cash", async () => {
    const token = await createUserAndLogin();

    const res = await request(app).get("/api/shop/cash").set("Cookie", token);

    expect(res.statusCode).toBe(200);
  });
});
