const authService = require("../services/auth.service");
const User = require("../models/user.model");
const Submission = require("../models/submission.model");

async function registerUser(req, res, next) {
  try {
    console.log("Registration request received:", req.body);
    await authService.createUser(req.body);
    console.log("User created successfully");
    return res.send("user registered");
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).send(err.message);
  }
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await authService.authenticateUser(email, password);

    // Check if authentication failed (returns error string)
    if (typeof user === "string" && user.includes("invalid")) {
      console.log("Authentication failed for email:", email);
      return res.status(401).send("Invalid email or password");
    }

    // Authentication successful - user is an object
    const token = authService.generateAuthToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).send("An error occurred during login");
  }
}
async function getCurrentUser(req, res, next) {
  return res.send(req.user.userId);
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select(
      "username email totalXP currentLevel completedLevels",
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    const submissionsCount = await Submission.countDocuments({
      userId: req.user.userId,
    });

    return res.status(200).json({ user, submissionsCount });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
}
async function logoutUser(req, res, next) {
  res.clearCookie("token");
  return res.send("Logged out");
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getMe,
  logoutUser,
};
