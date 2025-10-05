import React, { useState } from 'react';
import { Store, Building2, Users, CreditCard, BarChart3, Package } from 'lucide-react';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminProductTypes } from '../components/admin/AdminProductTypes';
import { UserManagement } from '../components/admin/UserManagement';
import { StoreManagement } from '../components/admin/StoreManagement';
import { MembershipManagement } from '../components/admin/MembershipManagement';
import { SalesReport } from '../components/admin/SalesReport';
import { StockReport } from '../components/admin/StockReport';
import { products as initialProducts } from '../data/products';
import { productTypes as initialProductTypes } from '../data/productTypes';
import { Product, ProductType, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';

export function Admin() {
  const { isSuperAdmin, isStoreAdmin } = useAuth();
  const { currentStore } = useStore();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productTypes, setProductTypes] = useState<ProductType[]>(initialProductTypes);
  const [users, setUsers] = useState<User[]>([]);

  // Handler functions for product types
  const handleAddType = (type: Omit<ProductType, 'id'>) => {
    const newType = {
      ...type,
      id: Math.max(...productTypes.map(t => t.id), 0) + 1
    };
    setProductTypes([...productTypes, newType]);
  };

  const handleUpdateType = (id: number, type: Omit<ProductType, 'id'>) => {
    setProductTypes(productTypes.map(t => 
      t.id === id ? { ...t, ...type } : t
    ));
  };

  const handleDeleteType = (id: number) => {
    setProductTypes(productTypes.filter(t => t.id !== id));
  };

  // Handler functions for products
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id: number, product: Omit<Product, 'id'>) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, ...product } : p
    ));
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Handler function for users
  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const newUser = {
      ...userData,
      id: Math.max(...users.map(u => u.id), 0) + 1
    };
    setUsers([...users, newUser]);
  };

  // Define available tabs based on user role
  const tabs = [
    { id: 'products', label: 'Products', icon: Package, show: true },
    { id: 'users', label: 'Users', icon: Users, show: true },
    { id: 'sales', label: 'Sales Report', icon: BarChart3, show: true },
    { id: 'stock', label: 'Stock Report', icon: Building2, show: true },
    { id: 'stores', label: 'Stores', icon: Store, show: isSuperAdmin() },
    { id: 'membership', label: 'Membership', icon: CreditCard, show: isSuperAdmin() },
  ];

  const visibleTabs = tabs.filter(tab => tab.show);

  return (
    <div className="space-y-6">
      {/* Store Info for Store Admins */}
      {isStoreAdmin() && currentStore && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-700">{currentStore.name}</h2>
          <p className="text-sm text-gray-600">{currentStore.address}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'products' && (
          <div className="space-y-8">
            <AdminProductTypes
              types={productTypes}
              onAddType={handleAddType}
              onUpdateType={handleUpdateType}
              onDeleteType={handleDeleteType}
            />
            <AdminProducts
              products={products}
              productTypes={productTypes}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagement 
            users={users}
            storeMembership={{
              id: 1,
              storeId: currentStore?.id || 0,
              planId: 1,
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
              isActive: true,
              currentUsers: users.length
            }}
            membershipPlan={{
              id: 1,
              name: 'Basic',
              price: 99000,
              maxUsers: 5,
              maxProducts: 100,
              features: ['Basic POS features', 'Up to 5 users'],
              duration: 1
            }}
            onAddUser={handleAddUser}
          />
        )}

        {activeTab === 'stores' && isSuperAdmin() && (
          <StoreManagement />
        )}

        {activeTab === 'membership' && isSuperAdmin() && (
          <MembershipManagement />
        )}

        {activeTab === 'sales' && (
          <SalesReport />
        )}

        {activeTab === 'stock' && (
          <StockReport products={products} />
        )}
      </div>
    </div>
  );
}