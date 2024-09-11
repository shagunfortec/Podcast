// controllers/userController.js
const User = require('../models/user');

// Register new user
exports.registerUser = async (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
  
    // Check if all fields are provided
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
  
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
  
    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
  
      // Create new user
      user = await User.create({
        firstName,
        lastName,
        email,
        password,
      });
  
      // Send token response with a success message
      sendTokenResponse(user, 201, res, 'User created successfully');
    } catch (error) {
      console.error('Registration error:', error.message); // Log the error for debugging
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

// Login user
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Send token response with a success message
    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user details
exports.updateUser = async (req, res, next) => {
    const { firstName, lastName, email } = req.body;
  
    // Check if the fields are provided
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
  
    try {
      // Update user
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { firstName, lastName, email },
        { new: true, runValidators: true }
      );
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
// Delete user account
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Token generator
const sendTokenResponse = (user, statusCode, res, message = '') => {
  const token = user.getSignedJwtToken(); // Generate the token
  res.status(statusCode).json({
    success: true,
    message: message,
    token: token
  });
};
