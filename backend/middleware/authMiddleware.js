const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, session token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, session expired or invalid" });
  }
};

module.exports = protect;