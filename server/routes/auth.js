const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateConfirmationToken, sendConfirmationEmail } = require('../utils/emailService');

const router = express.Router();

// Register user
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().custom(value => {
    if (!value.endsWith('@ucsd.edu')) {
      throw new Error('Email must be a UCSD email address');
    }
    return true;
  }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phoneNumber').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('major').trim().isLength({ min: 2 }).withMessage('Major is required'),
  body('year').isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']).withMessage('Invalid year'),
  body('gender').isIn(['Brother', 'Sister']).withMessage('Gender must be Brother or Sister')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, password, phoneNumber, major, year, gender, genderPreference } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate confirmation token
    const confirmationToken = generateConfirmationToken();
    const confirmationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = new User({
      name,
      email,
      password,
      phoneNumber,
      major,
      year,
      gender,
      genderPreference: genderPreference || false,
      emailConfirmationToken: confirmationToken,
      emailConfirmationExpires: confirmationExpires
    });

    await user.save();

    // Send confirmation email
    await sendConfirmationEmail(email, confirmationToken, name);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to confirm your account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Confirm email
router.get('/confirm-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailConfirmationToken: token,
      emailConfirmationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired confirmation token' });
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = undefined;
    user.emailConfirmationExpires = undefined;
    await user.save();

    res.json({ message: 'Email confirmed successfully! You can now log in.' });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ message: 'Server error during email confirmation' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is confirmed
    if (!user.isEmailConfirmed) {
      return res.status(400).json({ 
        message: 'Please confirm your email address before logging in' 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        major: user.major,
        year: user.year,
        gender: user.gender,
        genderPreference: user.genderPreference,
        classes: user.classes
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// Update user profile
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('major').optional().trim().isLength({ min: 2 }).withMessage('Major is required'),
  body('year').optional().isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']).withMessage('Invalid year'),
  body('genderPreference').optional().isBoolean().withMessage('Gender preference must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, phoneNumber, major, year, genderPreference } = req.body;

    // Build update object (exclude gender and email as they shouldn't be updatable)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (major !== undefined) updateData.major = major;
    if (year !== undefined) updateData.year = year;
    if (genderPreference !== undefined) updateData.genderPreference = genderPreference;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -emailConfirmationToken');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        major: user.major,
        year: user.year,
        gender: user.gender,
        genderPreference: user.genderPreference,
        classes: user.classes
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;
