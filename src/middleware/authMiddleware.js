const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protects a route: requires a valid "Authorization: Bearer <token>" header,
 * verifies the JWT, and attaches the corresponding user document to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user no longer exists');
    }

    if (user.isSuspended) {
      res.status(403);
      throw new Error('This account has been suspended');
    }

    req.user = user;
    next();
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(401);
    }
    next(error);
  }
};

/**
 * Restricts a route to users with role "admin". Supports the
 * "Admin/user management" item in the locked V1 scope.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  next(new Error('Not authorized as an admin'));
};

module.exports = { protect, adminOnly };
