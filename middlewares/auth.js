const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ err: "You need to send a token" });
  }
  try {
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.tokenData = decodeToken;
    next();
  }
  catch (err) {
    res.status(401).json({ err: "Token invalid or expired" });
  }
};
