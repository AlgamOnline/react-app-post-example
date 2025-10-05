// Base interfaces
export interface ProductType {
  id: number;
  name: string;
  storeId: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  typeId: number;
  stock: number;
  storeId: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Voucher {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  timestamp: string;
  paymentMethod: 'cash' | 'card' | 'qris' | 'ovo' | 'gopay';
  appliedVoucher?: Voucher;
  cashReceived?: number;
  storeId: number;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipNumber: string;
  tierId: number;
  points: number;
  totalSpent: number;
  joinDate: string;
  storeId: number;
}

export type UserRole = 'superadmin' | 'admin' | 'cashier';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  storeId: number;
  password?: string;
}

export interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  maxUsers: number;
  maxProducts: number;
  features: string[];
  duration: number;
}

export interface StoreMembership {
  id: number;
  storeId: number;
  planId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  currentUsers: number;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  logo?: string;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  membershipId?: number;
  isActive?: boolean;
  registrationDate?: string;
}