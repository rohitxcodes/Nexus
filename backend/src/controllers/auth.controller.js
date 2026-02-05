const authService = require("../services/auth.service");
async function registerUser(req, res, next) {
  try {
    await authService.createUser(req.body);
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
    const token = authService.generateAuthToken(user);
    res.cookie("token", token, {
      httpOnly: true,
    });
    return res.send("Login success");
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}
async function getCurrentUser(req, res, next) {
  return res.send(req.user.userId);
}
async function logoutUser(req, res, next) {
  res.clearCookie("token");
  return res.send("Logged out");
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};
