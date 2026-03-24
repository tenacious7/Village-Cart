import { useState, useEffect } from 'react';
import { Package, CheckCircle2, Search, Clock, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function Orders() {
  const { t } = useLanguage();
  const [cancelModalOrder, setCancelModalOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCancelOrder = async () => {
    if (cancelModalOrder) {
      try {
        const orderRef = doc(db, 'orders', cancelModalOrder.id);
        await updateDoc(orderRef, {
          status: 'Cancelled',
          cancelReason: cancelReason,
          cancelledAt: serverTimestamp()
        });
        setCancelModalOrder(null);
        setCancelReason('');
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Failed to cancel order.");
      }
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items?.some((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      className="space-y-4 pb-6"
    >
      <motion.div variants={itemVariants} className="relative px-4">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input 
          type="text" 
          placeholder={t('orders.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white pl-12 pr-4 py-3 rounded-xl font-medium text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-gray-100"
        />
      </motion.div>
      
      <div className="flex flex-col gap-3 px-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>No orders found</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <motion.div 
              key={order.id} 
              variants={itemVariants}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-colors"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                  {order.items?.[0]?.image ? (
                    <img src={order.items[0].image} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <Package className="text-gray-300" size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm flex items-center gap-1.5 ${
                      order.status === 'Pending' ? 'text-secondary' : 
                      order.status === 'Ready for Pickup' ? 'text-primary' : 
                      order.status === 'Cancelled' ? 'text-red-600' :
                      'text-text'
                    }`}>
                      {order.status === 'Pending' && <Clock size={16} />}
                      {order.status === 'Ready for Pickup' && <Package size={16} />}
                      {order.status === 'Completed' && <CheckCircle2 size={16} />}
                      {order.status === 'Cancelled' && <X size={16} />}
                      
                      {order.status === 'Pending' ? t('orders.orderPlaced') : 
                       order.status === 'Ready for Pickup' ? t('orders.readyForPickup') : 
                       order.status === 'Cancelled' ? t('orders.cancelled') :
                       t('orders.completedOn') + ' ' + order.date}
                    </span>
                  </div>
                  <p className="text-text font-medium text-sm line-clamp-1 mb-1">
                    {order.items?.length > 1 ? `${t('orders.multipleItems')} (${order.items.length})` : order.items?.[0]?.name || 'Order'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted">{t('orders.orderId')}: #ORD-{order.id.slice(-4).toUpperCase()}</span>
                    <span className="font-bold text-text">₹{order.total}</span>
                  </div>
                  
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => setCancelModalOrder(order)}
                      className="mt-3 w-full border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm py-2 rounded-lg transition-colors"
                    >
                      {t('orders.cancelOrder')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {cancelModalOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-text">{t('orders.cancelOrder')}</h3>
                <button onClick={() => setCancelModalOrder(null)} className="text-muted hover:text-text">
                  <X size={24} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-text">{t('orders.cancelConfirm')} #ORD-{cancelModalOrder.id.slice(-4).toUpperCase()}?</p>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">{t('orders.cancelReason')}</label>
                  <textarea 
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder={t('orders.cancelPlaceholder')}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none h-24"
                  ></textarea>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setCancelModalOrder(null)}
                    className="flex-1 bg-gray-100 text-text font-bold py-3 rounded-xl"
                  >
                    {t('orders.keepOrder')}
                  </button>
                  <button 
                    onClick={handleCancelOrder}
                    disabled={!cancelReason.trim()}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:shadow-md transition-all"
                  >
                    {t('orders.cancelOrder')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
