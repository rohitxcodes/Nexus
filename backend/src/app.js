const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes");
const levelRouter = require("./routes/level.routes");
const submissionRouter = require("./routes/submission.routes");
const xpRouter = require("./routes/xp.routes");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/levels", levelRouter);

app.use("/api/submissions", submissionRouter);
app.use("/api/xp", xpRouter);

module.exports = app;
