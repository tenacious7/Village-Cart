import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface HomeSection {
  id: string;
  title: string;
  title_od: string;
  type: 'banner' | 'new_arrivals' | 'featured_category' | 'custom_list';
  content: any;
  active: boolean;
  order: number;
}

interface ShopSettings {
  shopName: string;
  shopName_od: string;
  homeSections: HomeSection[];
}

interface ShopSettingsContextType {
  settings: ShopSettings | null;
  loading: boolean;
}

const ShopSettingsContext = createContext<ShopSettingsContextType | undefined>(undefined);

export function ShopSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'shop'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as ShopSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shop settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ShopSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </ShopSettingsContext.Provider>
  );
}

export function useShopSettings() {
  const context = useContext(ShopSettingsContext);
  if (context === undefined) {
    throw new Error('useShopSettings must be used within a ShopSettingsProvider');
  }
  return context;
}
