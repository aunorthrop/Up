const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/connect/square', authMiddleware, authController.connectSquare);
router.post('/connect/shopify', authMiddleware, authController.connectShopify);

module.exports = router;
