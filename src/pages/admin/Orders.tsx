import { useState, useEffect } from 'react';
import { Package, CheckCircle2, Search, Clock, ChevronDown, ChevronUp, X, Banknote } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminOrders() {
  const { t } = useLanguage();
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [packModalOrder, setPackModalOrder] = useState<any | null>(null);
  const [completeModalOrder, setCompleteModalOrder] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.customerName,
          items: data.items?.length || 0,
          total: data.total,
          status: data.status,
          date: data.createdAt?.toDate().toLocaleDateString() || 'N/A',
          itemsList: data.items || [],
          userId: data.userId
        };
      });
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePackOrder = async (orderId: string) => {
    try {
      // Calculate new total based on selected items
      const newTotal = packModalOrder.itemsList
        .filter((item: any) => item.selected)
        .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Ready for Pickup',
        items: packModalOrder.itemsList,
        total: newTotal
      });

      // Send notification to user
      await addDoc(collection(db, 'notifications'), {
        userId: packModalOrder.userId,
        title: 'Order Ready',
        message: `Your order #${orderId.slice(-4).toUpperCase()} is packed and ready for pickup!`,
        read: false,
        createdAt: serverTimestamp()
      });

      setPackModalOrder(null);
    } catch (error) {
      console.error("Error packing order:", error);
      alert("Failed to pack order.");
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Completed'
      });
      setCompleteModalOrder(null);
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Failed to complete order.");
    }
  };

  const toggleItemSelection = (index: number) => {
    if (!packModalOrder) return;
    const newItemsList = [...packModalOrder.itemsList];
    newItemsList[index].selected = !newItemsList[index].selected;
    
    // Recalculate total
    const newTotal = newItemsList
      .filter((item: any) => item.selected)
      .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    setPackModalOrder({
      ...packModalOrder,
      itemsList: newItemsList,
      total: newTotal
    });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredOrders = sortedOrders.filter(o => {
    const matchesStatus = filterStatus ? o.status === filterStatus : true;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h2 className="font-display text-3xl font-bold text-text">{t('admin.orders.title')}</h2>
      </motion.div>

      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.orders.search')} 
          className="w-full bg-white pl-12 pr-4 py-4 rounded-xl font-medium text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-gray-200 relative z-10 transition-all"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilterStatus(null)} className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap shadow-sm transition-all ${!filterStatus ? 'bg-gradient-to-r from-primary to-blue-600 text-white' : 'bg-white text-text border border-gray-200 hover:bg-gray-50'}`}>{t('orders.all')}</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilterStatus('Pending')} className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap shadow-sm transition-all ${filterStatus === 'Pending' ? 'bg-gradient-to-r from-secondary to-orange-500 text-white' : 'bg-white text-text border border-gray-200 hover:bg-gray-50'}`}>{t('orders.pending')}</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilterStatus('Ready for Pickup')} className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap shadow-sm transition-all ${filterStatus === 'Ready for Pickup' ? 'bg-gradient-to-r from-primary to-blue-500 text-white' : 'bg-white text-text border border-gray-200 hover:bg-gray-50'}`}>{t('orders.readyForPickup')}</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilterStatus('Completed')} className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap shadow-sm transition-all ${filterStatus === 'Completed' ? 'bg-gradient-to-r from-accent to-yellow-500 text-white' : 'bg-white text-text border border-gray-200 hover:bg-gray-50'}`}>{t('orders.completed')}</motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('id')}>Order ID</th>
                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('name')}>Customer</th>
                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('status')}>Status</th>
                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('total')}>Total</th>
                <th className="px-6 py-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('date')}>Date</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  if (order.status === 'Pending') setPackModalOrder(order);
                  else if (order.status === 'Ready for Pickup') setCompleteModalOrder(order);
                }}
              >
                <td className="px-6 py-4 font-mono font-medium">#ORD-{order.id.slice(-4).toUpperCase()}</td>
                <td className="px-6 py-4 font-medium">{order.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded font-bold text-xs ${
                    order.status === 'Pending' ? 'bg-secondary/10 text-secondary' : 
                    order.status === 'Ready for Pickup' ? 'bg-primary/10 text-primary' : 
                    'bg-accent/20 text-text'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">₹{order.total}</td>
                <td className="px-6 py-4">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </motion.div>

      {/* Pack Order Modal */}
      <AnimatePresence>
        {packModalOrder && (
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
                <h3 className="font-bold text-lg text-text">Review & Pack Order</h3>
                <button onClick={() => setPackModalOrder(null)} className="text-muted hover:text-text">
                  <X size={24} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-muted">Please verify you have packed the following items for <strong>{packModalOrder.name}</strong>:</p>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {packModalOrder.itemsList.map((item: any, idx: number) => (
                    <label key={idx} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={item.selected !== false} // Default to true if undefined
                        onChange={() => toggleItemSelection(idx)}
                        className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary" 
                      />
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${item.selected === false ? 'text-muted line-through' : 'text-text'}`}>{item.name}</div>
                        <div className="text-xs text-muted">Quantity: {item.is_loose ? (item.quantity >= 1 ? `${item.quantity}kg` : `${item.quantity * 1000}g`) : item.quantity}</div>
                      </div>
                      <div className={`font-bold text-sm ${item.selected === false ? 'text-muted line-through' : 'text-text'}`}>
                        ₹{item.price * item.quantity}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-text">Total Price to Collect</span>
                  <span className="font-bold text-2xl text-primary">₹{packModalOrder.total}</span>
                </div>
                <button 
                  onClick={() => handlePackOrder(packModalOrder.id)}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all mt-4"
                >
                  Mark as Packed & Notify User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Order Modal */}
      <AnimatePresence>
        {completeModalOrder && (
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
                <h3 className="font-bold text-lg text-text">Confirm Payment</h3>
                <button onClick={() => setCompleteModalOrder(null)} className="text-muted hover:text-text">
                  <X size={24} />
                </button>
              </div>
              <div className="p-5 space-y-4 text-center">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Banknote size={32} />
                </div>
                <h4 className="font-bold text-xl text-text">Collect ₹{completeModalOrder.total}</h4>
                <p className="text-sm text-muted">Confirm that <strong>{completeModalOrder.name}</strong> has paid and collected their order.</p>
                
                <button 
                  onClick={() => handleCompleteOrder(completeModalOrder.id)}
                  className="w-full bg-gradient-to-r from-secondary to-orange-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all mt-6"
                >
                  Confirm Payment & Complete Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
