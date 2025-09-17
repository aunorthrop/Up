const express = require('express');
const webhookController = require('../controllers/webhookController');
const router = express.Router();

// Square webhooks
router.post('/square', webhookController.handleSquareWebhook);

// Shopify webhooks  
router.post('/shopify', webhookController.handleShopifyWebhook);

module.exports = router;
