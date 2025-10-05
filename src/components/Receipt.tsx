import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface ReceiptProps {
  transaction: Transaction;
}

export function Receipt({ transaction }: ReceiptProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Receipt</h2>
        <p className="text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</p>
        <p className="text-gray-500">Transaction ID: {transaction.id}</p>
      </div>

      <div className="border-t border-b py-4 my-4">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Item</th>
              <th>Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td className="text-right">{formatCurrency(item.price)}</td>
                <td className="text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(transaction.subtotal)}</span>
        </div>
        
        {transaction.appliedVoucher && (
          <div className="flex justify-between text-green-600">
            <span>
              Discount ({transaction.appliedVoucher.code})
              {transaction.appliedVoucher.type === 'percentage' && 
                ` (${transaction.appliedVoucher.value}%)`
              }
            </span>
            <span>-{formatCurrency(transaction.discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{formatCurrency(transaction.total)}</span>
        </div>
        
        {transaction.paymentMethod === 'cash' && transaction.cashReceived && (
          <>
            <div className="flex justify-between">
              <span>Cash Received</span>
              <span>{formatCurrency(transaction.cashReceived)}</span>
            </div>
            <div className="flex justify-between">
              <span>Change</span>
              <span>{formatCurrency(transaction.cashReceived - transaction.total)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Payment Method</span>
          <span className="capitalize">{transaction.paymentMethod}</span>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500">
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
}