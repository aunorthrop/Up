const squareService = require('./squareService');
const shopifyService = require('./shopifyService');
const User = require('../models/User');
const SyncLog = require('../models/SyncLog');
const logger = require('../utils/logger');

class SyncService {
  async getStatus(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const recentLogs = await SyncLog.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const last24hSyncs = await SyncLog.countDocuments({
        userId,
        createdAt: { $gte: last24h }
      });

      const errors = await SyncLog.countDocuments({
        userId,
        status: 'error',
        createdAt: { $gte: last24h }
      });

      return {
        isConnected: user.squareConfig.isConnected && user.shopifyConfig.isConnected,
        lastSync: user.syncSettings.lastSyncAt,
        autoSync: user.syncSettings.autoSync,
        syncInterval: user.syncSettings.syncInterval,
        last24hSyncs,
        errors,
        recentLogs,
        totalProducts: 0, // Will be populated from actual sync data
        outOfStock: 0,    // Will be populated from actual sync data
      };
    } catch (error) {
      logger.error('Error getting sync status:', error);
      throw error;
    }
  }

  async triggerManualSync(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      if (!user.squareConfig.isConnected || !user.shopifyConfig.isConnected) {
        throw new Error('Both Square and Shopify must be connected');
      }

      const syncLog = new SyncLog({
        userId,
        type: 'manual',
        status: 'running',
        startedAt: new Date(),
      });
      await syncLog.save();

      try {
        // Get inventory from Square
        const squareItems = await squareService.getInventoryItems();
        
        // Get products from Shopify
        const shopifySession = shopifyService.createSession(
          user.shopifyConfig.shop,
          user.shopifyConfig.accessToken
        );
        const shopifyProducts = await shopifyService.getProducts(shopifySession);

        // Sync logic here - match products and update inventory
        const syncResults = await this.performSync(
          squareItems,
          shopifyProducts,
          user,
          shopifySession
        );

        // Update sync log
        syncLog.status = 'completed';
        syncLog.completedAt = new Date();
        syncLog.itemsProcessed = syncResults.processed;
        syncLog.itemsUpdated = syncResults.updated;
        syncLog.errors = syncResults.errors;
        await syncLog.save();

        // Update user's last sync time
        user.syncSettings.lastSyncAt = new Date();
        await user.save();

        return syncResults;
      } catch (error) {
        syncLog.status = 'error';
        syncLog.completedAt = new Date();
        syncLog.errorMessage = error.message;
        await syncLog.save();
        throw error;
      }
    } catch (error) {
      logger.error('Error in manual sync:', error);
      throw error;
    }
  }

  async performSync(squareItems, shopifyProducts, user, shopifySession) {
    let processed = 0;
    let updated = 0;
    const errors = [];

    try {
      // Create a map of Square items by SKU or name for matching
      const squareItemMap = new Map();
      for (const item of squareItems) {
        const itemData = item.itemData;
        if (itemData && itemData.variations) {
          for (const variation of itemData.variations) {
            const sku = variation.itemVariationData?.sku || itemData.name;
            if (sku) {
              // Get inventory count for this variation
              const counts = await squareService.getInventoryCount(variation.id);
              const totalQuantity = counts.reduce((sum, count) => 
                sum + parseInt(count.quantity || 0), 0
              );
              
              squareItemMap.set(sku, {
                id: variation.id,
                quantity: totalQuantity,
                locationId: counts[0]?.locationId,
              });
            }
          }
        }
      }

      // Update Shopify products with Square inventory
      for (const product of shopifyProducts) {
        for (const variant of product.variants) {
          processed++;
          
          const sku = variant.sku || product.title;
          const squareItem = squareItemMap.get(sku);
          
          if (squareItem && variant.inventory_item_id) {
            try {
              await shopifyService.updateInventoryLevel(
                shopifySession,
                variant.inventory_item_id,
                user.shopifyConfig.locationId,
                squareItem.quantity
              );
              updated++;
              logger.info(`Updated inventory for SKU ${sku}: ${squareItem.quantity}`);
            } catch (error) {
              errors.push(`Failed to update ${sku}: ${error.message}`);
              logger.error(`Error updating ${sku}:`, error);
            }
          }
        }
      }

      return { processed, updated, errors };
    } catch (error) {
      logger.error('Error in performSync:', error);
      throw error;
    }
  }

  async getSyncHistory(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const logs = await SyncLog.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await SyncLog.countDocuments({ userId });

      return {
        logs,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: skip + logs.length < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Error getting sync history:', error);
      throw error;
    }
  }

  async updateSettings(userId, settings) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      if (settings.autoSync !== undefined) {
        user.syncSettings.autoSync = settings.autoSync;
      }
      if (settings.syncInterval !== undefined) {
        user.syncSettings.syncInterval = Math.max(60, settings.syncInterval); // Min 1 minute
      }

      await user.save();
      return user.syncSettings;
    } catch (error) {
      logger.error('Error updating sync settings:', error);
      throw error;
    }
  }
}

module.exports = new SyncService();
