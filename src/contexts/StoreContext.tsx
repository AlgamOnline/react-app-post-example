import React, { createContext, useContext, useState } from 'react';
import { Store } from '../types';

interface StoreContextType {
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  return (
    <StoreContext.Provider value={{ currentStore, setCurrentStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}