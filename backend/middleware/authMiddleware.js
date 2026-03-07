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

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not authorized.` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };