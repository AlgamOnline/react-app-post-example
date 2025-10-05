import React, { useState } from 'react';
import { X, QrCode, CreditCard, Wallet } from 'lucide-react';
import { CartItem, Voucher } from '../types';
import { formatCurrency } from '../utils/format';
import { vouchers } from '../data/vouchers';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onProcessPayment: (method: 'cash' | 'card' | 'qris' | 'ovo' | 'gopay', voucher?: Voucher, cashReceived?: number) => void;
}

export function PaymentModal({ isOpen, onClose, items, subtotal, onProcessPayment }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qris' | 'ovo' | 'gopay'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  const applyVoucher = () => {
    const voucher = vouchers.find(v => v.code === voucherCode && v.isActive);
    
    if (!voucher) {
      setVoucherError('Invalid or inactive voucher code');
      return;
    }

    if (voucher.minPurchase && subtotal < voucher.minPurchase) {
      setVoucherError(`Minimum purchase of ${formatCurrency(voucher.minPurchase)} required`);
      return;
    }

    setAppliedVoucher(voucher);
    setVoucherError('');
  };

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    
    if (appliedVoucher.type === 'percentage') {
      return Math.round(subtotal * (appliedVoucher.value / 100));
    }
    return appliedVoucher.value;
  };

  const total = subtotal - calculateDiscount();

  const handlePayment = () => {
    if (paymentMethod === 'cash') {
      const cashAmount = parseFloat(cashReceived);
      if (isNaN(cashAmount) || cashAmount < total) {
        setError('Please enter a valid amount that covers the total');
        return;
      }
      onProcessPayment('cash', appliedVoucher || undefined, cashAmount);
    } else {
      onProcessPayment(paymentMethod, appliedVoucher || undefined);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Subtotal: {formatCurrency(subtotal)}</h3>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Enter voucher code"
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={applyVoucher}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Apply
              </button>
            </div>
            
            {voucherError && (
              <p className="text-red-500 text-sm">{voucherError}</p>
            )}
            
            {appliedVoucher && (
              <div className="bg-green-50 p-2 rounded-md mb-2">
                <p className="text-green-600 text-sm">
                  Voucher applied: {appliedVoucher.code} 
                  ({appliedVoucher.type === 'percentage' ? `${appliedVoucher.value}%` : formatCurrency(appliedVoucher.value)} off)
                </p>
                <p className="text-green-600 font-semibold">
                  Discount: {formatCurrency(calculateDiscount())}
                </p>
              </div>
            )}

            <div className="border-t pt-2 mb-4">
              <p className="font-bold text-lg flex justify-between">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                className={`p-3 rounded-md flex flex-col items-center gap-1 ${
                  paymentMethod === 'cash'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => {
                  setPaymentMethod('cash');
                  setShowQR(false);
                }}
              >
                <Wallet size={24} />
                <span className="text-sm">Cash</span>
              </button>
              <button
                className={`p-3 rounded-md flex flex-col items-center gap-1 ${
                  paymentMethod === 'card'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => {
                  setPaymentMethod('card');
                  setShowQR(false);
                }}
              >
                <CreditCard size={24} />
                <span className="text-sm">Card</span>
              </button>
              <button
                className={`p-3 rounded-md flex flex-col items-center gap-1 ${
                  paymentMethod === 'qris'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => {
                  setPaymentMethod('qris');
                  setShowQR(true);
                }}
              >
                <QrCode size={24} />
                <span className="text-sm">QRIS</span>
              </button>
              <button
                className={`p-3 rounded-md flex flex-col items-center gap-1 ${
                  paymentMethod === 'ovo'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => {
                  setPaymentMethod('ovo');
                  setShowQR(true);
                }}
              >
                <QrCode size={24} />
                <span className="text-sm">OVO</span>
              </button>
              <button
                className={`p-3 rounded-md flex flex-col items-center gap-1 ${
                  paymentMethod === 'gopay'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => {
                  setPaymentMethod('gopay');
                  setShowQR(true);
                }}
              >
                <QrCode size={24} />
                <span className="text-sm">GoPay</span>
              </button>
            </div>

            {showQR && (
              <div className="text-center mb-4">
                <div className="bg-gray-100 p-4 rounded-lg mb-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `Payment for ${total} IDR using ${paymentMethod.toUpperCase()}`
                    )}`}
                    alt="Payment QR Code"
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Scan this QR code to pay with {paymentMethod.toUpperCase()}
                </p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cash Received
                </label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter amount"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                {parseFloat(cashReceived) > total && (
                  <p className="text-green-600 mt-2">
                    Change: {formatCurrency(parseFloat(cashReceived) - total)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}