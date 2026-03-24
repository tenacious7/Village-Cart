import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  console.log('NotificationProvider rendering');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('notificationSound');
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('notificationSound', String(soundEnabled));
    } catch (e) {}
  }, [soundEnabled]);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return;
    }

    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user?.uid);
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = undefined;
      }

      if (user) {
        try {
          const q = query(
            collection(db, 'notifications'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );

          unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            setNotifications(prev => {
              const updated = [...prev];
              snapshot.docChanges().forEach((change) => {
                const data = change.doc.data() as any;
                if (change.type === 'added') {
                  if (!updated.find(n => n.id === change.doc.id)) {
                    updated.push({ id: change.doc.id, ...data });
                    
                    // Play sound for new unread notifications
                    if (!data.read && soundEnabled) {
                      try {
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                        audio.play().catch(e => console.log('Audio play failed:', e));
                      } catch (e) {}
                    }
                  }
                } else if (change.type === 'modified') {
                  const index = updated.findIndex(n => n.id === change.doc.id);
                  if (index !== -1) {
                    updated[index] = { id: change.doc.id, ...data };
                  }
                } else if (change.type === 'removed') {
                  const index = updated.findIndex(n => n.id === change.doc.id);
                  if (index !== -1) {
                    updated.splice(index, 1);
                  }
                }
              });
              return updated.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
                const timeB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
                return timeB - timeA;
              });
            });
          }, (error) => {
            console.error('Notification snapshot error:', error);
          });
        } catch (error) {
          console.error('Error setting up notification listener:', error);
        }
      } else {
        setNotifications([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [soundEnabled]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, soundEnabled, setSoundEnabled }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}