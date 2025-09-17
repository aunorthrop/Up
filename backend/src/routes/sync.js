const express = require('express');
const syncController = require('../controllers/syncController');
const router = express.Router();

// Get sync status and stats
router.get('/status', syncController.getStatus);

// Trigger manual sync
router.post('/trigger', syncController.triggerSync);

// Get sync history/logs
router.get('/history', syncController.getHistory);

// Update sync settings
router.put('/settings', syncController.updateSettings);

module.exports = router;
