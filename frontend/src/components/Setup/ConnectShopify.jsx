import React, { useState } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { ExternalLink, Store, MapPin, Key, CheckCircle, AlertCircle } from 'lucide-react';

const ConnectShopify = ({ isConnected, onConnectionChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shop: '',
    accessToken: '',
    locationId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure shop URL is properly formatted
      let shopUrl = formData.shop.toLowerCase().trim();
      if (!shopUrl.includes('.myshopify.com')) {
        shopUrl = shopUrl.replace(/\..*/, '') + '.myshopify.com';
      }

      await api.post('/auth/connect/shopify', {
        ...formData,
        shop: shopUrl,
      });

      toast.success('Shopify connected successfully!');
      onConnectionChange(true);
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to connect Shopify');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Shopify? This will stop inventory syncing.')) {
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/disconnect/shopify');
      toast.success('Shopify disconnected');
      onConnectionChange(false);
    } catch (error) {
      toast.error('Failed to disconnect Shopify');
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-md border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Shopify Store Connected
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Your Shopify store is connected and ready to sync inventory.</p>
          <p className="mt-1">Product inventory will be updated automatically from your POS.</p>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-200">
          <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">Shopify store not connected</span>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p>Connect your Shopify store to sync inventory automatically:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Update online inventory from POS</li>
            <li>Prevent overselling across channels</li>
            <li>Real-time stock synchronization</li>
            <li>Multi-location inventory management</li>
          </ul>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Connect Shopify Store
        </button>

        <div className="text-xs text-gray-500">
          <p>Need help? 
            <a 
              href="https://partners.shopify.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 ml-1"
            >
              Visit Shopify Partners
              <ExternalLink className="h-3 w-3 inline ml-1" />
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Store className="h-4 w-4 mr-2" />
          Shop Domain
        </label>
        <div className="flex">
          <input
            type="text"
            required
            value={formData.shop}
            onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="your-shop-name"
          />
          <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md">
            .myshopify.com
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter your shop name (e.g., "mystore" for mystore.myshopify.com)
        </p>
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Key className="h-4 w-4 mr-2" />
          Access Token
        </label>
        <input
          type="password"
          required
          value={formData.accessToken}
          onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your Shopify access token"
        />
        <p className="text-xs text-gray-500 mt-1">
          Private app access token with inventory permissions
        </p>
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          Location ID
        </label>
        <input
          type="text"
          required
          value={formData.locationId}
          onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your Shopify location ID"
        />
        <p className="text-xs text-gray-500 mt-1">
          The location where inventory will be managed
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Connecting...' : 'Connect Shopify'}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions:</h4>
        <ol className="list-decimal list-inside text-xs text-blue-800 space-y-1">
          <li>Go to your Shopify Admin → Apps → App and sales channel settings</li>
          <li>Click "Develop apps" → "Create an app"</li>
          <li>Configure Admin API scopes: read_products, write_products, read_inventory, write_inventory</li>
          <li>Generate access token and copy it here</li>
          <li>Find your location ID in Settings → Locations</li>
        </ol>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-medium">Required Shopify permissions:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>read_products & write_products (manage products)</li>
          <li>read_inventory & write_inventory (update stock levels)</li>
        </ul>
      </div>
    </form>
  );
};

export default ConnectShopify;
