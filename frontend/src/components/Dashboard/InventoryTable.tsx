import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, outOfStock, lowStock, synced

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/sync/inventory');
      setInventory(response.data.items || []);
    } catch (error) {
      toast.error('Failed to fetch inventory');
      // Mock data for development
      setInventory(mockInventoryData);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filter) {
      case 'outOfStock':
        return item.squareQuantity === 0 || item.shopifyQuantity === 0;
      case 'lowStock':
        return item.squareQuantity <= 5 || item.shopifyQuantity <= 5;
      case 'synced':
        return item.squareQuantity === item.shopifyQuantity;
      default:
        return true;
    }
  });

  const getQuantityStatus = (squareQty, shopifyQty) => {
    if (squareQty === shopifyQty) {
      return { status: 'synced', icon: CheckCircle, color: 'text-green-500' };
    } else {
      return { status: 'out-of-sync', icon: AlertCircle, color: 'text-yellow-500' };
    }
  };

  const getStockLevel = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (quantity <= 5) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-medium text-gray-900">Inventory Overview</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Items</option>
                <option value="outOfStock">Out of Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="synced">Synced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Square Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shopify Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => {
              const quantityStatus = getQuantityStatus(item.squareQuantity, item.shopifyQuantity);
              const squareStock = getStockLevel(item.squareQuantity);
              const shopifyStock = getStockLevel(item.shopifyQuantity);
              const StatusIcon = quantityStatus.icon;

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={item.image || 'https://via.placeholder.com/40'}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${squareStock.color}`}>
                      {item.squareQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${shopifyStock.color}`}>
                      {item.shopifyQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StatusIcon className={`h-4 w-4 ${quantityStatus.color} mr-2`} />
                      <span className="text-sm text-gray-900 capitalize">
                        {quantityStatus.status.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Connect your Square and Shopify accounts to see inventory.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data for development
const mockInventoryData = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    category: 'Beverages',
    sku: 'PCB-001',
    squareQuantity: 25,
    shopifyQuantity: 25,
    image: 'https://via.placeholder.com/40',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Organic Tea Blend',
    category: 'Beverages',
    sku: 'OTB-002',
    squareQuantity: 15,
    shopifyQuantity: 12,
    image: 'https://via.placeholder.com/40',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Artisan Chocolate',
    category: 'Confectionery',
    sku: 'AC-003',
    squareQuantity: 0,
    shopifyQuantity: 5,
    image: 'https://via.placeholder.com/40',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Handmade Soap',
    category: 'Personal Care',
    sku: 'HS-004',
    squareQuantity: 8,
    shopifyQuantity: 8,
    image: 'https://via.placeholder.com/40',
    lastUpdated: new Date().toISOString(),
  },
];

export default InventoryTable;
