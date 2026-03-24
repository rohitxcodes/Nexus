const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  extraHeaders: {
    Cookie:
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTliODZkYjgxYWYxYjgyZDZlNzBiN2MiLCJpYXQiOjE3NzQzNzk5NTh9.TKsMK_EY_QKLsgnzdgC2yT3r23lvW2FhEHO9yvQXtyY; Path=/; Secure; HttpOnly; Expires=Tue, 31 Mar 2026 19:19:17 GMT;",
  },
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // Join clan
  socket.emit("chat:join", {
    clanId: "69c1935fe112072f22b05f54",
  });

  console.log("➡️ Joined clan");

  // Send message
  setTimeout(() => {
    socket.emit("chat:send", {
      clanId: "69c1935fe112072f22b05f54",
      content: "Hello from test client 🚀",
    });
  }, 1000);
});

// Listen for messages
socket.on("chat:message", (msg) => {
  console.log("📩 Message received:", msg);
});

socket.on("chat:error", (err) => {
  console.log("❌ Error:", err);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
