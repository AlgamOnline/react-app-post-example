import { Voucher } from '../types';

export const vouchers: Voucher[] = [
  {
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    minPurchase: 100000,
    isActive: true,
  },
  {
    code: 'DISC25K',
    type: 'fixed',
    value: 25000,
    minPurchase: 200000,
    isActive: true,
  },
];