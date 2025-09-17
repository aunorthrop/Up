require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
