// START ADDED: JWT access token helpers
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "90d";
const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || "ifb_access_secret_change_me";

function createAccessToken(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

function sanitizeUser(user) {
  if (!user || typeof user !== "object") {
    return user;
  }

  const sanitizedUser = { ...user };
  delete sanitizedUser.users_password;
  delete sanitizedUser.password;

  return sanitizedUser;
}

module.exports = {
  ACCESS_TOKEN_EXPIRES_IN,
  createAccessToken,
  sanitizeUser,
  verifyAccessToken,
};
// END ADDED: JWT access token helpers
