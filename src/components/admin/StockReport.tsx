import React, { useState } from 'react';
import { Package, AlertTriangle, Download } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/format';

interface StockReportProps {
  products: Product[];
}

export function StockReport({ products }: StockReportProps) {
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const LOW_STOCK_THRESHOLD = 10;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterType) {
      case 'low':
        return matchesSearch && product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
      case 'out':
        return matchesSearch && product.stock === 0;
      default:
        return matchesSearch;
    }
  });

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const downloadReport = () => {
    // Implementation for downloading report as CSV/Excel
    console.log('Downloading stock report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Stock Report</h2>
        <button
          onClick={downloadReport}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Total Products</h3>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Low Stock</h3>
              <p className="text-2xl font-bold">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Out of Stock</h3>
              <p className="text-2xl font-bold">{outOfStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Total Value</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | 'low' | 'out')}
          className="p-2 border rounded-md"
        >
          <option value="all">All Products</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(product.price * product.stock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : product.stock <= LOW_STOCK_THRESHOLD
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.stock === 0
                        ? 'Out of Stock'
                        : product.stock <= LOW_STOCK_THRESHOLD
                        ? 'Low Stock'
                        : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}