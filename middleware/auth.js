// START ADDED: auth middleware for admin protection
const { sanitizeUser, verifyAccessToken } = require("../controllers/authToken");

function extractBearerToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || typeof authHeader !== "string") {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7).trim();
}

function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return res.status(401).json({
        status: "failure",
        message: "Access token is required.",
      });
    }

    const decodedToken = verifyAccessToken(token);
    req.authUser = sanitizeUser(decodedToken);

    next();
  } catch (error) {
    return res.status(401).json({
      status: "failure",
      message: "Invalid or expired access token.",
    });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.authUser || req.authUser.role !== "admin") {
      return res.status(403).json({
        status: "failure",
        message: "Admin access is required.",
      });
    }

    next();
  });
}

module.exports = {
  requireAdmin,
  requireAuth,
};
// END ADDED: auth middleware for admin protection
