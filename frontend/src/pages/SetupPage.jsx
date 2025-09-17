import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import Header from '../components/Common/Header';
import Sidebar from '../components/Common/Sidebar';
import ConnectSquare from '../components/Setup/ConnectSquare';
import ConnectShopify from '../components/Setup/ConnectShopify';
import { CheckCircle, XCircle, Settings, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SetupPage = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState({
    square: false,
    shopify: false,
  });
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: 300, // 5 minutes
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnectionStatus();
  }, []);

  const fetchConnectionStatus = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      setConnections({
        square: userData.squareConnected || false,
        shopify: userData.shopifyConnected || false,
      });
      if (userData.syncSettings) {
        setSyncSettings(userData.syncSettings);
      }
    } catch (error) {
      toast.error('Failed to fetch connection status');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionUpdate = (platform, status) => {
    setConnections(prev => ({
      ...prev,
      [platform]: status,
    }));
  };

  const updateSyncSettings = async (newSettings) => {
    try {
      await api.put('/sync/settings', newSettings);
      setSyncSettings(newSettings);
      toast.success('Sync settings updated successfully');
    } catch (error) {
      toast.error('Failed to update sync settings');
    }
  };

  const getSetupProgress = () => {
    const total = 2;
    const completed = Object.values(connections).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const progress = getSetupProgress();
  const isFullyConnected = progress === 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup & Connections</h1>
              <p className="text-gray-600">
                Connect your POS and e-commerce platforms to start syncing inventory.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Setup Progress</h3>
                <span className="text-sm text-gray-600">{progress}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isFullyConnected ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {isFullyConnected && (
                <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-green-800">
                      All platforms connected! Your inventory will sync automatically.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Connection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Square Connection */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">□</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Square POS</h3>
                        <p className="text-sm text-gray-600">Point of Sale System</p>
                      </div>
                    </div>
                    {connections.square ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <ConnectSquare 
                    isConnected={connections.square}
                    onConnectionChange={(status) => handleConnectionUpdate('square', status)}
                  />
                </div>
              </div>

              {/* Shopify Connection */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-lg">S</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Shopify</h3>
                        <p className="text-sm text-gray-600">E-commerce Platform</p>
                      </div>
                    </div>
                    {connections.shopify ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <ConnectShopify 
                    isConnected={connections.shopify}
                    onConnectionChange={(status) => handleConnectionUpdate('shopify', status)}
                  />
                </div>
              </div>
            </div>

            {/* Sync Settings */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Sync Settings</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Auto Sync Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Automatic Sync
                      </label>
                      <p className="text-sm text-gray-600">
                        Automatically sync inventory at regular intervals
                      </p>
                    </div>
                    <button
                      onClick={() => updateSyncSettings({
                        ...syncSettings,
                        autoSync: !syncSettings.autoSync,
                      })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        syncSettings.autoSync ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          syncSettings.autoSync ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Sync Interval */}
                  {syncSettings.autoSync && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Sync Interval
                      </label>
                      <select
                        value={syncSettings.syncInterval}
                        onChange={(e) => updateSyncSettings({
                          ...syncSettings,
                          syncInterval: parseInt(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={60}>1 minute</option>
                        <option value={300}>5 minutes</option>
                        <option value={600}>10 minutes</option>
                        <option value={1800}>30 minutes</option>
                        <option value={3600}>1 hour</option>
                      </select>
                      <p className="text-sm text-gray-600 mt-1">
                        How often to check for inventory changes
                      </p>
                    </div>
                  )}

                  {/* Warning for incomplete setup */}
                  {!isFullyConnected && (
                    <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">
                            Setup Required
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Connect both Square and Shopify to enable automatic syncing.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SetupPage;
