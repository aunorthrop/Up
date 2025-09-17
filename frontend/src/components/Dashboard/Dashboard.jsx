import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import SyncStatus from './SyncStatus';
import InventoryTable from './InventoryTable';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [syncData, setSyncData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    fetchSyncData();
    const interval = setInterval(fetchSyncData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSyncData = async () => {
    try {
      const response = await api.get('/sync/status');
      setSyncData(response.data);
      setLastSync(new Date().toLocaleString());
    } catch (error) {
      toast.error('Failed to fetch sync data');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerManualSync = async () => {
    try {
      setIsLoading(true);
      await api.post('/sync/trigger');
      toast.success('Manual sync triggered successfully');
      await fetchSyncData();
    } catch (error) {
      toast.error('Failed to trigger sync');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !syncData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="text-gray-600">
            Last synced: {lastSync || 'Never'}
          </p>
        </div>
        <button
          onClick={triggerManualSync}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Syncing...' : 'Manual Sync'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Products Synced</p>
              <p className="text-2xl font-semibold">{syncData?.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-semibold">{syncData?.outOfStock || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Sync Errors</p>
              <p className="text-2xl font-semibold text-red-600">{syncData?.errors || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Last 24h Syncs</p>
              <p className="text-2xl font-semibold">{syncData?.last24hSyncs || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Status */}
      <SyncStatus data={syncData} />

      {/* Inventory Table */}
      <InventoryTable />
    </div>
  );
};

export default Dashboard;
