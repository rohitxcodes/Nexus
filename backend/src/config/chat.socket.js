const jwt = require("jsonwebtoken");
const chatService = require("../services/chat.service");

// Cookie parser helper — Socket.io doesn't parse cookies automatically
function parseCookies(cookieHeader = "") {
  const cookies = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) cookies[key.trim()] = decodeURIComponent(value.trim());
  });
  return cookies;
}

function registerChatSocket(io) {
  // ── Auth — runs before every connection is accepted ────────
  io.use((socket, next) => {
    try {
      // Read token from cookie (same as your auth middleware)
      const cookieHeader = socket.handshake.headers.cookie || "";
      const cookies = parseCookies(cookieHeader);
      const token = cookies.token;

      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_SIGNATURE);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] User ${socket.userId} connected`);

    // ── Join clan room ────────────────────────────────────────
    // Client emits this automatically on page load
    // Payload: { clanId }
    socket.on("chat:join", async ({ clanId }) => {
      try {
        await chatService.assertMembership(socket.userId, clanId);
        socket.join(clanId);
        console.log(`[Socket] User ${socket.userId} joined clan ${clanId}`);
      } catch (err) {
        socket.emit("chat:error", { message: err.message });
      }
    });

    // ── Send message ──────────────────────────────────────────
    // Payload: { clanId, content }
    socket.on("chat:send", async ({ clanId, content }) => {
      try {
        const saved = await chatService.saveMessage(
          clanId,
          socket.userId,
          content,
        );
        // Broadcast to ALL members including sender
        io.to(clanId).emit("chat:message", saved);
      } catch (err) {
        socket.emit("chat:error", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] User ${socket.userId} disconnected`);
    });
  });
}

module.exports = { registerChatSocket };
