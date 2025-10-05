import React, { useState } from 'react';
import { BarChart, Calendar, Download } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/format';

// Mock data - replace with API calls in production
const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    items: [
      { id: 1, name: 'Coffee', price: 25000, quantity: 2, image: 'https://example.com/coffee.jpg', type: 'Beverages', stock: 98 },
      { id: 2, name: 'Burger', price: 45000, quantity: 1, image: 'https://example.com/burger.jpg', type: 'Fast Food', stock: 49 }
    ],
    subtotal: 95000,
    discount: 0,
    total: 95000,
    timestamp: '2024-03-10T10:30:00Z',
    paymentMethod: 'cash',
    storeId: 1
  },
  {
    id: '2',
    items: [
      { id: 3, name: 'Pizza', price: 89000, quantity: 1, image: 'https://example.com/pizza.jpg', type: 'Fast Food', stock: 29 }
    ],
    subtotal: 89000,
    discount: 0,
    total: 89000,
    timestamp: '2024-03-10T11:15:00Z',
    paymentMethod: 'card',
    storeId: 1
  }
];

export function SalesReport() {
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return TRANSACTIONS.filter(transaction => {
      const txDate = new Date(transaction.timestamp);
      
      switch (dateRange) {
        case 'today':
          return txDate >= today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return txDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return txDate >= monthAgo;
        case 'custom':
          const start = startDate ? new Date(startDate) : new Date(0);
          const end = endDate ? new Date(endDate) : new Date();
          return txDate >= start && txDate <= end;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();
  
  const totalSales = filteredTransactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageTransaction = totalTransactions > 0
    ? totalSales / totalTransactions
    : 0;

  const salesByPaymentMethod = filteredTransactions.reduce((acc, tx) => {
    acc[tx.paymentMethod] = (acc[tx.paymentMethod] || 0) + tx.total;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = filteredTransactions
    .flatMap(tx => tx.items)
    .reduce((acc, item) => {
      const existing = acc.find(p => p.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
        existing.total += item.price * item.quantity;
      } else {
        acc.push({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          total: item.price * item.quantity
        });
      }
      return acc;
    }, [] as Array<{
      id: number;
      name: string;
      quantity: number;
      total: number;
    }>)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const downloadReport = () => {
    // Implementation for downloading report as CSV/Excel
    const csvContent = [
      ['Date', 'Transaction ID', 'Items', 'Payment Method', 'Total'],
      ...filteredTransactions.map(tx => [
        new Date(tx.timestamp).toLocaleDateString(),
        tx.id,
        tx.items.length.toString(),
        tx.paymentMethod,
        tx.total.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Sales Report</h2>
        <button
          onClick={downloadReport}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded-md"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <BarChart size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Total Sales</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Transactions</h3>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <BarChart size={24} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Average Transaction</h3>
              <p className="text-2xl font-bold">{formatCurrency(averageTransaction)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Sales by Payment Method</h3>
          <div className="space-y-4">
            {Object.entries(salesByPaymentMethod).map(([method, total]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="capitalize">{method}</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Top 5 Products</h3>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.quantity} sold)
                  </span>
                </div>
                <span className="font-semibold">{formatCurrency(product.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border">
        <h3 className="text-lg font-semibold p-4 border-b">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tx.items.length} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {tx.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatCurrency(tx.total)}
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