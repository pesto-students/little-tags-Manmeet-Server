const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // Get the token from header;
  const token = req.header("x-auth-token");
  const SECRET_KEY = config.get("SECRET_KEY");
  if (!token) {
    return res.status(401).json({
      status: false,
      full_messages: "Access denied: No token authorization",
    });
  }

  // Verify token
  try {
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          status: false,
          full_messages: "Invalid: Token is not Valid",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};
