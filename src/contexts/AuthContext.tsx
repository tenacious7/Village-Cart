import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase signOut error:", e);
    }
    localStorage.removeItem('demo_user');
    setUser(null);
    setUserData(null);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const checkDemoUser = () => {
      const demoUserJson = localStorage.getItem('demo_user');
      if (demoUserJson) {
        try {
          const demoUser = JSON.parse(demoUserJson);
          setUserData(demoUser);
          // Create a mock Firebase user object
          setUser({
            uid: demoUser.uid,
            email: `${demoUser.phone}@shop.com`,
            displayName: demoUser.fullName || demoUser.shopName,
          } as User);
          setLoading(false);
          return true;
        } catch (e) {
          localStorage.removeItem('demo_user');
        }
      }
      return false;
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        setLoading(false);
      } else {
        // If no Firebase user, check for Demo user
        if (!checkDemoUser()) {
          setUser(null);
          setUserData(null);
          setLoading(false);
        }
      }
    });

    // Listen for storage events (for Demo Mode login)
    window.addEventListener('storage', checkDemoUser);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', checkDemoUser);
    };
  }, []);

  const isAdmin = userData?.role === 'admin';
  const isDemo = userData?.isDemo === true;

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
