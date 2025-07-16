import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateEncryptionKey } from '../utils/encryption.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user with unique encryption key
    const encryptionKey = generateEncryptionKey();
    const user = new User({
      username,
      email,
      password,
      encryptionKey
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'No account found with this email address' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password. Please try again.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Forgot Password (basic implementation - in production you'd send emails)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'No account found with this email address' });
    }

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Save it to the database with expiration
    // 3. Send an email with reset link
    
    // For now, we'll just return a success message
    res.json({ 
      message: 'Password reset instructions have been sent to your email address',
      // In development, you might want to show the reset token
      resetToken: 'demo-reset-token-' + Date.now()
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error processing password reset request' });
  }
});

export default router;