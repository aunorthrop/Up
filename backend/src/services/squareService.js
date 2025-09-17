const { Client, Environment } = require('squareup');
const logger = require('../utils/logger');

class SquareService {
  constructor() {
    this.client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: process.env.SQUARE_ENVIRONMENT === 'production' 
        ? Environment.Production 
        : Environment.Sandbox
    });
    
    this.catalogApi = this.client.catalogApi;
    this.inventoryApi = this.client.inventoryApi;
  }

  async getInventoryItems() {
    try {
      const response = await this.catalogApi.listCatalog(
        undefined, // cursor
        'ITEM'      // types
      );

      if (response.result.errors) {
        throw new Error(`Square API error: ${JSON.stringify(response.result.errors)}`);
      }

      return response.result.objects || [];
    } catch (error) {
      logger.error('Error fetching Square inventory:', error);
      throw error;
    }
  }

  async getInventoryCount(catalogObjectId) {
    try {
      const response = await this.inventoryApi.retrieveInventoryCount(catalogObjectId);
      
      if (response.result.errors) {
        throw new Error(`Square API error: ${JSON.stringify(response.result.errors)}`);
      }

      return response.result.counts || [];
    } catch (error) {
      logger.error(`Error getting inventory count for ${catalogObjectId}:`, error);
      throw error;
    }
  }

  async updateInventory(catalogObjectId, locationId, quantity) {
    try {
      const response = await this.inventoryApi.batchChangeInventory({
        idempotencyKey: `update-${catalogObjectId}-${Date.now()}`,
        changes: [{
          type: 'PHYSICAL_COUNT',
          physicalCount: {
            catalogObjectId,
            locationId,
            quantity: quantity.toString(),
            occurredAt: new Date().toISOString()
          }
        }]
      });

      if (response.result.errors) {
        throw new Error(`Square API error: ${JSON.stringify(response.result.errors)}`);
      }

      return response.result;
    } catch (error) {
      logger.error(`Error updating Square inventory for ${catalogObjectId}:`, error);
      throw error;
    }
  }
}

module.exports = new SquareService();
