const syncService = require('../services/syncService');
const logger = require('../utils/logger');

class SyncController {
  async getStatus(req, res) {
    try {
      const status = await syncService.getStatus(req.user._id);
      res.json(status);
    } catch (error) {
      logger.error('Error getting sync status:', error);
      res.status(500).json({ error: 'Failed to get sync status' });
    }
  }

  async triggerSync(req, res) {
    try {
      const result = await syncService.triggerManualSync(req.user._id);
      res.json({ message: 'Sync triggered successfully', result });
    } catch (error) {
      logger.error('Error triggering sync:', error);
      res.status(500).json({ error: 'Failed to trigger sync' });
    }
  }

  async getHistory(req, res) {
    try {
      const { page = 1, limit = 20 } = req.
