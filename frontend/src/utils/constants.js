// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CONNECT_SQUARE: '/auth/connect/square',
    CONNECT_SHOPIFY: '/auth/connect/shopify',
  },
  SYNC: {
    STATUS: '/sync/status',
    TRIGGER: '/sync/trigger',
    HISTORY: '/sync/history',
    SETTINGS: '/sync/settings',
    INVENTORY: '/sync/inventory',
  },
  WEBHOOKS: {
    SQUARE: '/webhooks/square',
    SHOPIFY: '/webhooks/shopify',
  },
};

// Sync Status Types
export const SYNC_STATUS = {
  RUNNING: 'running',
  COMPLETED: 'completed',
  ERROR: 'error',
  PENDING: 'pending',
};

// Sync Types
export const SYNC_TYPES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic',
  WEBHOOK: 'webhook',
};

// Platform Names
export const PLATFORMS = {
  SQUARE: 'square',
  SHOPIFY: 'shopify',
};

// Stock Level Constants
export const STOCK_LEVELS = {
  OUT_OF_STOCK: 0,
  LOW_STOCK_THRESHOLD: 5,
  WARNING_THRESHOLD: 10,
};

// Sync Intervals (in seconds)
export const SYNC_INTERVALS = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
};

// UI Constants
export const COLORS = {
  PRIMARY: 'blue',
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
  GRAY: 'gray',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  CONNECTION_FAILED: 'Failed to connect to the platform.',
  SYNC_FAILED: 'Sync operation failed.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  CONNECTION_SUCCESS: 'Platform connected successfully!',
  SYNC_SUCCESS: 'Sync completed successfully!',
  SETTINGS_UPDATED: 'Settings updated successfully!',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
};

// Default Values
export const DEFAULTS = {
  SYNC_INTERVAL: SYNC_INTERVALS.FIVE_MINUTES,
  AUTO_SYNC: true,
  PAGE_SIZE: 20,
  REFRESH_INTERVAL: 30000, // 30 seconds
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SETUP: '/setup',
  ACTIVITY: '/activity',
  HELP: '/help',
  SETTINGS: '/settings',
};

export default {
  API_ENDPOINTS,
  SYNC_STATUS,
  SYNC_TYPES,
  PLATFORMS,
  STOCK_LEVELS,
  SYNC_INTERVALS,
  COLORS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  DEFAULTS,
  ROUTES,
};
