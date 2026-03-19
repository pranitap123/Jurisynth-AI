// ✅ SIMPLE VERSION (no JWT for now – stable & working)

const protect = (req, res, next) => {
  try {
    // Dummy user for testing
    req.user = {
      id: "123456789",
      role: "user"
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized"
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not authorized`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };