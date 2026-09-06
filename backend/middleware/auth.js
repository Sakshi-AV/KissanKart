const jwt = require('jsonwebtoken');
const Storage = require('../services/storage');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kissan_kart_super_secret_jwt_key_2026_harvest');
    const user = await Storage.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }

    req.user = user;

    // If farmer, attach farmer profile
    if (user.role === 'farmer') {
      const farmerProfile = await Storage.findFarmerByUserId(user._id);
      req.farmer = farmerProfile;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.'
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to perform this action.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  requireRole
};
