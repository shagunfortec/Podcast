const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Authenticate user
exports.authenticate = async (req, res, next) => {
  let token = req.headers.authorization;

  console.log('Token received:', token); // Log the token for debugging

  if (!token || !token.startsWith('Bearer ')) {
    console.log('No token provided'); // Log if token is not provided or is incorrect
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  token = token.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Token decoded:', decoded); // Log decoded token info

    // Find the user by ID from the token
    req.user = await User.findById(decoded.id);
    console.log('User found:', req.user); // Log user details

    if (!req.user) {
      console.log('User not found'); // Log if the user is not found in the database
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next(); // Continue if user is authenticated
  } catch (error) {
    console.error('Authentication error:', error.message); // Log specific error details
    return res.status(401).json({ success: false, message: 'Not authorized', error: error.message });
  }
};

// Role-based authorization
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log('User role:', req.user.role); // Log the user's role
    if (!req.user || !roles.includes(req.user.role)) {
      console.log('Access denied: Invalid role'); // Log if the role does not match
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
  };
};
