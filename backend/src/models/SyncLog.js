const mongoose = require('mongoose');

const syncLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['manual', 'automatic', 'webhook'],
    required: true,
  },
  status: {
    type: String,
    enum: ['running', 'completed', 'error'],
    required: true,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
  },
  itemsProcessed: {
    type: Number,
    default: 0,
  },
  itemsUpdated: {
    type: Number,
    default: 0,
  },
  errors: [{
    type: String,
  }],
  errorMessage: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
syncLogSchema.index({ userId: 1, createdAt: -1 });
syncLogSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('SyncLog', syncLogSchema);
