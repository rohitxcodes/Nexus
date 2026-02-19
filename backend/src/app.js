const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const levelRouter = require("./routes/level.routes");
const submissionRouter = require("./routes/submission.routes");
const xpRouter = require("./routes/xp.routes");
const healthRouter = require("./routes/health.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://code-quest-nexus.vercel.app", // Vercel frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server tools like Postman/curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Nexus API running");
});
app.use("/api/auth", authRouter);
app.use("/api/levels", levelRouter);
app.use("/api/submissions", submissionRouter);
app.use("/api/xp", xpRouter);
app.use("/health", healthRouter);

module.exports = app;
