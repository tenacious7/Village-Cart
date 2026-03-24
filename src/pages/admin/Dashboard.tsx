import { useState, useEffect } from 'react';
import { ShoppingCart, IndianRupee, AlertTriangle, Clock, Plus, Package, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenue: 0,
    lowStock: 0,
    pendingOrdersCount: 0
  });
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(startOfToday);

    // 1. Listen to Orders Today
    const ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', todayTimestamp)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data());
      const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      setStats(prev => ({
        ...prev,
        ordersToday: orders.length,
        revenue
      }));
    });

    // 2. Listen to Low Stock Products
    const productsQuery = query(
      collection(db, 'products'),
      where('quantity', '<', 10)
    );

    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      setStats(prev => ({
        ...prev,
        lowStock: snapshot.size
      }));
    });

    // 3. Listen to Pending Orders
    const pendingQuery = query(
      collection(db, 'orders'),
      where('status', '==', 'Pending'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribePending = onSnapshot(pendingQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingOrders(orders);
      setStats(prev => ({
        ...prev,
        pendingOrdersCount: snapshot.size
      }));
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribePending();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-3xl font-bold text-text">{t('admin.dash.title')}</h2>
        <p className="text-muted font-medium mt-1">{t('admin.dash.subtitle')}</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
          <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Package.png" alt="Package" className="absolute -right-2 -bottom-2 w-16 h-16 opacity-80 drop-shadow-md rotate-[-10deg]" />
          <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-3 relative z-10">
            <ShoppingCart size={20} />
          </div>
          <p className="text-muted font-medium text-sm relative z-10">{t('admin.dash.ordersToday')}</p>
          <p className="font-display text-3xl font-bold text-text relative z-10">{stats.ordersToday}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-200 rounded-full opacity-30 blur-2xl"></div>
          <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Money%20Bag.png" alt="Money Bag" className="absolute -right-2 -bottom-2 w-16 h-16 opacity-80 drop-shadow-md rotate-[10deg]" />
          <div className="bg-secondary/10 w-10 h-10 rounded-xl flex items-center justify-center text-secondary mb-3 relative z-10">
            <IndianRupee size={20} />
          </div>
          <p className="text-muted font-medium text-sm relative z-10">{t('admin.dash.revenue')}</p>
          <p className="font-display text-3xl font-bold text-text relative z-10">₹{stats.revenue}</p>
        </motion.div>
        <Link to="/admin/inventory">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-br from-red-50 to-white p-5 rounded-2xl shadow-sm border border-red-100 block transition-colors h-full relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-200 rounded-full opacity-30 blur-2xl"></div>
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Warning.png" alt="Warning" className="absolute -right-2 -bottom-2 w-14 h-14 opacity-60 drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
            <div className="bg-red-100 w-10 h-10 rounded-xl flex items-center justify-center text-red-600 mb-3 relative z-10">
              <AlertTriangle size={20} />
            </div>
            <p className="text-red-600 font-medium text-sm relative z-10">{t('admin.dash.lowStock')}</p>
            <p className="font-display text-3xl font-bold text-red-600 relative z-10">{stats.lowStock}</p>
          </motion.div>
        </Link>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-yellow-50 to-white p-5 rounded-2xl shadow-sm border border-yellow-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-200 rounded-full opacity-30 blur-2xl"></div>
          <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Alarm%20Clock.png" alt="Clock" className="absolute -right-2 -bottom-2 w-16 h-16 opacity-80 drop-shadow-md rotate-[-5deg]" />
          <div className="bg-accent/20 w-10 h-10 rounded-xl flex items-center justify-center text-yellow-600 mb-3 relative z-10">
            <Clock size={20} />
          </div>
          <p className="text-yellow-600 font-medium text-sm relative z-10">{t('orders.pending')}</p>
          <p className="font-display text-3xl font-bold text-yellow-600 relative z-10">{stats.pendingOrdersCount}</p>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h3 className="font-display text-xl font-bold text-text mb-4">{t('admin.dash.quickActions')}</h3>
        <div className="grid grid-cols-1 gap-4">
          <Link to="/admin/inventory">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-r from-accent to-yellow-400 text-text p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all h-full relative overflow-hidden">
              <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Bags.png" alt="Shopping Bags" className="absolute left-4 w-12 h-12 drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
              <Plus size={20} /> {t('admin.dash.addProduct')}
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Pending Orders */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-xl font-bold text-text">{t('orders.pending')}</h3>
          <Link to="/admin/orders" className="text-primary font-bold text-sm hover:underline">{t('admin.dash.seeAll')}</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          {pendingOrders.length === 0 ? (
            <div className="w-full text-center py-8 text-muted font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No pending orders
            </div>
          ) : (
            pendingOrders.map(order => (
              <motion.div 
                key={order.id} 
                whileHover={{ scale: 1.02 }}
                className="min-w-[280px] bg-gradient-to-b from-white to-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100 snap-center"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded font-mono font-medium text-xs text-muted">#ORD-{order.id.slice(-4).toUpperCase()}</span>
                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded font-bold text-xs">{t('orders.pending')}</span>
                </div>
                <h4 className="font-bold text-text text-lg line-clamp-1">{order.customerName || 'Customer'}</h4>
                <p className="text-muted text-sm font-medium mb-4">{order.items?.length} {t('orders.items')} • ₹{order.total}</p>
                <Link to="/admin/orders">
                  <motion.button whileTap={{ scale: 0.95 }} className="w-full bg-gradient-to-r from-secondary to-orange-500 text-white py-2.5 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all">{t('admin.dash.markPacked')}</motion.button>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
