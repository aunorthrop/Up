const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const { restResources } = require('@shopify/shopify-api/rest/admin/2023-07');
const logger = require('../utils/logger');

class ShopifyService {
  constructor() {
    this.shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      scopes: ['read_products', 'write_products', 'read_inventory', 'write_inventory'],
      hostName: 'localhost:3001',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
      restResources,
    });
  }

  createSession(shop, accessToken) {
    return {
      shop,
      accessToken,
      id: `${shop}_session`,
      state: 'online',
      isOnline: true,
    };
  }

  async getProducts(session) {
    try {
      const client = new this.shopify.clients.Rest({ session });
      const products = await client.get({
        path: 'products',
        query: { limit: 250 }
      });

      return products.body.products || [];
    } catch (error) {
      logger.error('Error fetching Shopify products:', error);
      throw error;
    }
  }

  async updateInventoryLevel(session, inventoryItemId, locationId, available) {
    try {
      const client = new this.shopify.clients.Rest({ session });
      
      const response = await client.post({
        path: 'inventory_levels/set',
        data: {
          inventory_item_id: inventoryItemId,
          location_id: locationId,
          available
        }
      });

      return response.body;
    } catch (error) {
      logger.error(`Error updating Shopify inventory for item ${inventoryItemId}:`, error);
      throw error;
    }
  }

  async getInventoryLevels(session, inventoryItemIds) {
    try {
      const client = new this.shopify.clients.Rest({ session });
      
      const response = await client.get({
        path: 'inventory_levels',
        query: { 
          inventory_item_ids: inventoryItemIds.join(','),
          limit: 250 
        }
      });

      return response.body.inventory_levels || [];
    } catch (error) {
      logger.error('Error fetching Shopify inventory levels:', error);
      throw error;
    }
  }
}

module.exports = new ShopifyService();
