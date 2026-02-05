const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
async function createUser(payload) {
  const { username, email, password } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    passwordHash: hashedPassword,
  });
  return user;
}
async function authenticateUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) return "invalid credentails !";
  const verify = await bcrypt.compare(password, user.passwordHash);
  if (!verify) return "invalid credentails !";

  return user;
}
function generateAuthToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SIGNATURE);
}
module.exports = { createUser, authenticateUser, generateAuthToken };
