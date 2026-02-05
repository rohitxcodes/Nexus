const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/auth.routes");
const levelRouter = require("./routes/level.routes");
const submissionRouter = require("./routes/submission.routes");
const xpRouter = require("./routes/xp.routes");
const cookieParser = require("cookie-parser");

// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true // Allow cookies
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/levels", levelRouter);

app.use("/api/submissions", submissionRouter);
app.use("/api/xp", xpRouter);

module.exports = app;
