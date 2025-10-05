import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "Coffee",
    price: 25000,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&h=200",
    typeId: 1, // Beverages
    stock: 100,
    storeId: 1
  },
  {
    id: 2,
    name: "Burger",
    price: 45000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&h=200",
    typeId: 2, // Fast Food
    stock: 50,
    storeId: 1
  },
  {
    id: 3,
    name: "Pizza",
    price: 89000,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&h=200",
    typeId: 2, // Fast Food
    stock: 30,
    storeId: 2
  },
  {
    id: 4,
    name: "Salad",
    price: 35000,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&h=200",
    typeId: 3, // Healthy
    stock: 45,
    storeId: 2
  }
];