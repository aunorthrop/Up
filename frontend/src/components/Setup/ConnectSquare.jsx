import React, { useState } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { ExternalLink, Key, MapPin, Webhook, CheckCircle, AlertCircle } from 'lucide-react';

const ConnectSquare = ({ isConnected, onConnectionChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: '',
    accessToken: '',
    locationId: '',
    webhookSignatureKey: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/connect/square', formData);
      toast.success('Square connected successfully!');
      onConnectionChange(true);
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to connect Square');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Square? This will stop inventory syncing.')) {
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/disconnect/square');
      toast.success('Square disconnected');
      onConnectionChange(false);
    } catch (error) {
      toast.error('Failed to disconnect Square');
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
              Square POS Connected
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
          <p>Your Square POS is connected and ready to sync inventory.</p>
          <p className="mt-1">Products and inventory levels will be synchronized automatically.</p>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-200">
          <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">Square POS not connected</span>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p>Connect your Square POS to sync inventory automatically:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Real-time inventory updates</li>
            <li>Automatic stock level synchronization</li>
            <li>Webhook notifications for changes</li>
            <li>Multi-location support</li>
          </ul>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Connect Square POS
        </button>

        <div className="text-xs text-gray-500">
          <p>Need help? 
            <a 
              href="https://developer.squareup.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              Visit Square Developer Portal
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
          <Key className="h-4 w-4 mr-2" />
          Application ID
        </label>
        <input
          type="text"
          required
          value={formData.applicationId}
          onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your Square Application ID"
        />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your Square Access Token"
        />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your Square Location ID"
        />
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Webhook className="h-4 w-4 mr-2" />
          Webhook Signature Key
        </label>
        <input
          type="password"
          value={formData.webhookSignatureKey}
          onChange={(e) => setFormData({ ...formData, webhookSignatureKey: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter webhook signature key (optional)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional: Used for webhook verification
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Connecting...' : 'Connect Square'}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-medium">Where to find these values:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Application ID & Access Token: Square Developer Dashboard</li>
          <li>Location ID: Square Dashboard → Locations</li>
          <li>Webhook Key: Square Developer Dashboard → Webhooks</li>
        </ul>
      </div>
    </form>
  );
};
