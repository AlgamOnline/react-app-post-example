import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <span className="px-2 py-1 bg-gray-100 text-sm rounded-full">
          {product.type}
        </span>
      </div>
      <p className="text-gray-600 mb-2">{formatCurrency(product.price)}</p>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
          Stock: {product.stock}
        </span>
      </div>
      <button
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
        className={`mt-auto px-4 py-2 rounded-md transition-colors ${
          product.stock === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}