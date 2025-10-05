import React, { useState } from 'react';
import { ShoppingCart, History, Settings, ArrowLeft, LogOut } from 'lucide-react';
import { Product, CartItem, Transaction } from './types';
import { products as initialProducts } from './data/products';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { PaymentModal } from './components/PaymentModal';
import { Receipt } from './components/Receipt';
import { TransactionHistory } from './components/TransactionHistory';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { StoreRegistration } from './pages/StoreRegistration';
import { MembershipSettings } from './pages/MembershipSettings';
import { useAuth } from './contexts/AuthContext';
import { useStore } from './contexts/StoreContext';

export default function App() {
  const { user, logout } = useAuth();
  const { currentStore } = useStore();
  const [currentPage, setCurrentPage] = useState('main');
  const [products, setProducts] = useState(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<Transaction | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);

  if (!user) {
    if (currentPage === 'register') {
      return <StoreRegistration onBack={() => setCurrentPage('main')} />;
    }
    if (currentPage === 'membership') {
      return <MembershipSettings onBack={() => setCurrentPage('main')} />;
    }
    return <Login onRegister={() => setCurrentPage('register')} onMembership={() => setCurrentPage('membership')} />;
  }

  // Filter products by current store
  const storeProducts = products.filter(product => product.storeId === currentStore?.id);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(
        cartItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = (
    method: 'cash' | 'card' | 'qris' | 'ovo' | 'gopay',
    voucher?: any,
    cashReceived?: number
  ) => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discount = voucher
      ? voucher.type === 'percentage'
        ? Math.round(subtotal * (voucher.value / 100))
        : voucher.value
      : 0;

    const total = subtotal - discount;

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      items: cartItems,
      subtotal,
      discount,
      total,
      timestamp: new Date().toISOString(),
      paymentMethod: method,
      appliedVoucher: voucher,
      cashReceived,
      storeId: currentStore?.id || 0
    };

    setTransactions([transaction, ...transactions]);
    setCurrentReceipt(transaction);
    setCartItems([]);
    setIsPaymentModalOpen(false);

    // Update product stock
    const updatedProducts = products.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  // Get unique product types for the current store
  const productTypes = Array.from(
    new Set(storeProducts.map(product => product.typeId))
  );

  const filteredProducts = selectedType
    ? storeProducts.filter(product => product.typeId === selectedType)
    : storeProducts;

  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">
                {currentStore?.name} • {user.username}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
          <Admin />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">{currentStore?.name}</h1>
                <p className="text-sm text-gray-600">{user.username} • Cashier</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  key="history-button"
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <History size={20} />
                  History
                </button>
                <button
                  key="cart-button"
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <ShoppingCart size={20} />
                  Cart ({cartItems.length})
                </button>
                <button
                  key="logout-button"
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Product Type Filter */}
          <div className="p-4 bg-white border-b">
            <div className="flex gap-2">
              <button
                key="all-types"
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-md ${
                  selectedType === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {productTypes.map(typeId => (
                <button
                  key={`type-${typeId}`}
                  onClick={() => setSelectedType(typeId)}
                  className={`px-4 py-2 rounded-md ${
                    selectedType === typeId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {typeId}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sliding Cart Panel */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50">
            <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft size={24} />
                </button>
              </div>
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          items={cartItems}
          subtotal={cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )}
          onProcessPayment={handleProcessPayment}
        />

        {/* Transaction History Modal */}
        {isHistoryOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Transaction History</h2>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft size={24} />
                </button>
              </div>
              <TransactionHistory
                transactions={transactions}
                onViewReceipt={setCurrentReceipt}
              />
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {currentReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Receipt</h2>
                <button
                  onClick={() => setCurrentReceipt(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft size={24} />
                </button>
              </div>
              <Receipt transaction={currentReceipt} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}