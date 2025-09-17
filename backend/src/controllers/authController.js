const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

class AuthController {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  }

  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const user = new User({ email, password, name });
      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = this.generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          squareConnected: user.squareConfig.isConnected,
          shopifyConnected: user.shopifyConfig.isConnected,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          squareConnected: user.squareConfig.isConnected,
          shopifyConnected: user.shopifyConfig.isConnected,
          syncSettings: user.syncSettings,
        },
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name } = req.body;
      const user = await User.findById(req.user._id);
      
      if (name) user.name = name;
      await user.save();

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async connectSquare(req, res) {
    try {
      const { applicationId, accessToken, locationId, webhookSignatureKey } = req.body;
      
      const user = await User.findById(req.user._id);
      user.squareConfig = {
        applicationId,
        accessToken,
        locationId,
        webhookSignatureKey,
        isConnected: true,
      };
      
      await user.save();
      
      res.json({ message: 'Square connected successfully' });
    } catch (error) {
      logger.error('Connect Square error:', error);
      res.status(500).json({ error: 'Failed to connect Square' });
    }
  }

  async connectShopify(req, res) {
    try {
      const { shop, accessToken, locationId } = req.body;
      
      const user = await User.findById(req.user._id);
      user.shopifyConfig = {
        shop,
        accessToken,
        locationId,
        isConnected: true,
      };
      
      await user.save();
      
      res.json({ message: 'Shopify connected successfully' });
    } catch (error) {
      logger.error('Connect Shopify error:', error);
      res.status(500).json({ error: 'Failed to connect Shopify' });
    }
  }
}

module.exports = new AuthController();
