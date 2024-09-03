const User = require('../models/UserModel');//import the User model
const jwt = require('jsonwebtoken');//used to create, sign, and verify tokens for authentication


// Registration logic
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create and save the new user
    user = new User({ email, password });
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login logic
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT tokenreates a token containing the user's unique ID (user._id). This token serves as a digital identity proof for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login logic
exports.view = async (req, res) => {
  try {
    const view = await User.find();
    res.status(200).json({data: view });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};