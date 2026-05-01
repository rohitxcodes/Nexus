const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { registerChatSocket } = require("./src/config/chat.socket");
const connectToMongoDB = require("./src/config/db");
const app = require("./src/app");

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

function logBoot(event, details = "") {
  const timestamp = new Date().toISOString();
  console.log(`[BOOT ${timestamp}] ${event}${details ? ` :: ${details}` : ""}`);
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  },
});

registerChatSocket(io);
logBoot("Socket.IO initialized");

connectToMongoDB();
logBoot("Mongo connection initiated");

process.on("unhandledRejection", (reason) => {
  console.error("[UnhandledRejection]", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[UncaughtException]", error);
});

server.on("error", (error) => {
  console.error("[ServerError]", error);
});

server.listen(PORT, () => {
  logBoot("Server started", `env=${NODE_ENV} url=http://localhost:${PORT}`);
});

async function gracefulShutdown(signal) {
  logBoot("Shutdown signal received", signal);

  server.close(async () => {
    try {
      await mongoose.connection.close();
      logBoot("Mongo connection closed");
    } catch (error) {
      console.error("[ShutdownError] Failed to close Mongo connection", error);
    } finally {
      logBoot("HTTP server closed");
      process.exit(0);
    }
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
