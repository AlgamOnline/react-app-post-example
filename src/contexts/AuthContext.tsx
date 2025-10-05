import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { useStore } from './StoreContext';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isSuperAdmin: () => boolean;
  isStoreAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// In a real app, this would be in a secure database
const USERS: (User & { password: string })[] = [
  { 
    id: 1, 
    username: 'superadmin', 
    password: 'super123', 
    role: 'superadmin' as UserRole, 
    email: 'super@example.com',
    storeId: 0 // Superadmin doesn't belong to any store
  },
  { 
    id: 2, 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin' as UserRole, 
    email: 'admin@example.com',
    storeId: 1 
  },
  { 
    id: 3, 
    username: 'cashier', 
    password: 'cashier123', 
    role: 'cashier' as UserRole, 
    email: 'cashier@example.com',
    storeId: 1 
  },
  { 
    id: 4, 
    username: 'store2admin', 
    password: 'admin123', 
    role: 'admin' as UserRole, 
    email: 'store2admin@example.com',
    storeId: 2 
  }
];

// Mock store data
const STORES = {
  1: {
    id: 1,
    name: 'Downtown Store',
    address: '123 Main St',
    phone: '555-0123',
    owner: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0100'
    }
  },
  2: {
    id: 2,
    name: 'Mall Store',
    address: '456 Mall Ave',
    phone: '555-0456',
    owner: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-0200'
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { setCurrentStore } = useStore();

 const login = (username: string, password: string) => {
  console.log("username:", username);
  console.log("password:", password);
  console.log("USERS:", USERS);

  // Pastikan USERS tersedia
  if (!Array.isArray(USERS) || USERS.length === 0) {
    console.error("❌ USERS belum ter-load atau kosong");
    return false;
  }

  // Reset dulu state user & store sebelum login baru
  setUser(null);
  setCurrentStore(null);

  // Cari user
  const foundUser = USERS.find(
    (u) => u.username === username && u.password === password
  );

  console.log("foundUser:", foundUser);

  if (foundUser) {
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);

    // Jika user bukan superadmin, set store sesuai storeId
    if (foundUser.role !== "superadmin") {
      const userStore = STORES[foundUser.storeId as keyof typeof STORES];
      if (userStore) {
        setCurrentStore(userStore);
      } else {
        console.warn("⚠️ Store tidak ditemukan untuk storeId:", foundUser.storeId);
      }
    }

    console.log("✅ Login berhasil untuk:", foundUser.username);
    return true;
  }

  console.warn("❌ Username atau password salah");
  return false;
};


  const logout = () => {
    setUser(null);
    setCurrentStore(null);
  };

  const isSuperAdmin = () => user?.role === 'superadmin';
  const isStoreAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isSuperAdmin, isStoreAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[useAuth] AuthContext tidak ditemukan. Pastikan komponen ini dibungkus oleh <AuthProvider>."
      );
    }
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}