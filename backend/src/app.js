const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const levelRouter = require("./routes/level.routes");
const submissionRouter = require("./routes/submission.routes");
const xpRouter = require("./routes/xp.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Vercel frontend URL
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

module.exports = app;
