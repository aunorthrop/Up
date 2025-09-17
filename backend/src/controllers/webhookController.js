const crypto = require('crypto');
const logger = require('../utils/logger');
const syncService = require('../services/syncService');

class WebhookController {
  async handleSquareWebhook(req, res) {
    try {
      // Verify webhook signature
      const signature = req.headers['x-square-signature'];
      const body = JSON.stringify(req.body);
      
      if (!this.verifySquareSignature(signature, body)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const { type, data } = req.body;
      
      if (type === 'inventory.count.updated') {
        // Handle inventory update
        logger.info('Square inventory update received:', data);
        // Trigger sync for affected user
        // You'll need to identify the user based on the webhook data
      }

      res.json({ status: 'received' });
    } catch (error) {
      logger.error('Square webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  async handleShopifyWebhook(req, res) {
    try {
      // Verify webhook signature
      const hmac = req.headers['x-shopify-hmac-sha256'];
      const body = JSON.stringify(req.body);
      
      if (!this.verifyShopifySignature(hmac, body)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Handle different webhook types
      const topic = req.headers['x-shopify-topic'];
      
      if (topic === 'orders/create' || topic === 'orders/updated') {
        logger.info('Shopify order webhook received:', req.body);
        // Trigger sync to update inventory
      }

      res.json({ status: 'received' });
    } catch (error) {
      logger.error('Shopify webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  verifySquareSignature(signature, body) {
    if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || !signature) {
      return false;
    }
    
    const hash = crypto
      .createHmac('sha1', process.env.SQUARE_WEBHOOK_SIGNATURE_KEY)
      .update(body)
      .digest('base64');
    
    return signature === hash;
  }

  verifyShopifySignature(hmac, body) {
    if (!process.env.SHOPIFY_WEBHOOK_SECRET || !hmac) {
      return false;
    }
    
    const hash = crypto
      .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
      .update(body)
      .digest('base64');
    
    return hmac === hash;
  }
}

module.exports = new WebhookController();
