const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SIGNATURE);
    req.user = { userId: decoded.userId };

    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}
module.exports = requireAuth;
