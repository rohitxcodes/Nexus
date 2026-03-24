const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const { Server } = require("socket.io");
const { registerChatSocket } = require("./src/config/chat.socket");
const connectToMongoDB = require("./src/config/db");
const app = require("./src/app");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://code-quest-nexus.vercel.app",
    ],
    credentials: true,
  },
});

registerChatSocket(io);
connectToMongoDB();

app.get("/", (req, res) => {
  res.send("nexus");
});

server.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server Started at the Port http://localhost:${process.env.PORT}`,
  );
});
