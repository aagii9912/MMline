// JWT authentication and role-based authorization helpers
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Optional role check, if role passed only allow matching users
const authorize = (role) => (req, res, next) => {
  if (role && req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = { authenticate, authorize };
