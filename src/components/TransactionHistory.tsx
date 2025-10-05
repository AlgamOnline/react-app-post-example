import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onViewReceipt: (transaction: Transaction) => void;
}

export function TransactionHistory({ transactions, onViewReceipt }: TransactionHistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onViewReceipt(transaction)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">ID: {transaction.id}</p>
              </div>
              <span className="font-bold">{formatCurrency(transaction.total)}</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="capitalize">{transaction.paymentMethod}</span> •{' '}
              {transaction.items.length} items
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}