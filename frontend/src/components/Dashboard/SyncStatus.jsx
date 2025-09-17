import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const SyncStatus = ({ data }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      case 'running':
        return 'Running';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    }
  };

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sync Status</h3>
        <p className="text-gray-500">No sync data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Sync Activity</h3>
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${data.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-gray-600">
            {data.isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {data.recentLogs && data.recentLogs.length > 0 ? (
        <div className="space-y-3">
          {data.recentLogs.slice(0, 5).map((log) => (
            <div
              key={log._id}
              className={`p-3 rounded-md border ${getStatusColor(log.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <p className="text-sm font-medium">
                      {log.type.charAt(0).toUpperCase() + log.type.slice(1)} Sync
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(log.startedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{getStatusText(log.status)}</p>
                  {log.itemsProcessed > 0 && (
                    <p className="text-xs text-gray-600">
                      {log.itemsUpdated}/{log.itemsProcessed} updated
                    </p>
                  )}
                </div>
              </div>
              {log.errorMessage && (
                <p className="text-xs text-red-600 mt-2">{log.errorMessage}</p>
              )}
              {log.errors && log.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-red-600">Errors:</p>
                  {log.errors.slice(0, 3).map((error, index) => (
                    <p key={index} className="text-xs text-red-600">• {error}</p>
                  ))}
                  {log.errors.length > 3 && (
                    <p className="text-xs text-red-600">... and {log.errors.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No recent sync activity</p>
      )}

      {data.autoSync && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Auto-sync enabled (every {Math.floor(data.syncInterval / 60)} minutes)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatus;
