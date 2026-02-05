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
  console.log("Authenticating user with email:", email);
  
  // Step 1: Check if user exists in database
  const user = await User.findOne({ email });
  if (!user) {
    console.log("User not found with email:", email);
    return "invalid credentials";
  }
  
  console.log("User found, comparing passwords...");
  
  // Step 2: Compare provided password with hashed password in database
  const verify = await bcrypt.compare(password, user.passwordHash);
  if (!verify) {
    console.log("Password mismatch for email:", email);
    return "invalid credentials";
  }

  console.log("Authentication successful for user:", user.username);
  return user;
}
function generateAuthToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SIGNATURE);
}
module.exports = { createUser, authenticateUser, generateAuthToken };
