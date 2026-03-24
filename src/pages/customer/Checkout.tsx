import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Clock, Banknote, ChevronRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function Checkout() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const [success, setSuccess] = useState(false);
  const [collectionMethod, setCollectionMethod] = useState('Pickup');
  const [paymentOption, setPaymentOption] = useState('PayAtShop');
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discount = 50; // Mock discount
  const finalTotal = total - discount;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: auth.currentUser.uid,
        customerName: auth.currentUser.displayName || 'Customer',
        customerPhone: auth.currentUser.phoneNumber || '',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.cartQuantity,
          is_loose: item.is_loose,
          unit: item.unit || '',
          selected: true // Default all selected for vendor
        })),
        total: finalTotal,
        status: 'Pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id.slice(-4).toUpperCase());
      setSuccess(true);
      clearCart();
      
      setTimeout(() => {
        navigate('/customer/orders');
      }, 2000);
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

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

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white p-8 rounded-2xl flex flex-col items-center max-w-sm w-full"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={48} className="text-secondary" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl font-bold text-text mb-2"
          >
            {t('checkout.placed')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted mb-4 font-medium"
          >
            {t('orders.orderId')}: #ORD-{orderId}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-text text-sm mb-8"
          >
            {t('checkout.notify')}
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4 pb-6"
    >
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full text-primary">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="font-bold text-text text-sm">{t('cart.safePayment')}</h3>
          <p className="text-xs text-muted">{t('cart.authentic')}</p>
        </div>
      </motion.div>

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-text font-bold text-sm uppercase tracking-wider mb-4">
            <span className="bg-primary text-white w-5 h-5 rounded-sm flex items-center justify-center text-xs">1</span>
            {t('checkout.collectionMethod')}
          </div>
          <div className="pl-7 space-y-3">
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${collectionMethod === 'Pickup' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
              <input 
                type="radio" 
                name="collection" 
                value="Pickup"
                checked={collectionMethod === 'Pickup'}
                onChange={() => setCollectionMethod('Pickup')}
                className="w-4 h-4 text-primary focus:ring-primary" 
              />
              <div className="flex flex-col">
                <span className={`text-sm ${collectionMethod === 'Pickup' ? 'font-bold text-text' : 'font-medium text-text'}`}>{t('checkout.pickUpFromShop')}</span>
                <span className="text-xs text-muted">{t('checkout.readyIn')}</span>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${collectionMethod === 'Delivery' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
              <input 
                type="radio" 
                name="collection" 
                value="Delivery"
                checked={collectionMethod === 'Delivery'}
                onChange={() => setCollectionMethod('Delivery')}
                className="w-4 h-4 text-primary focus:ring-primary" 
                disabled 
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted">{t('checkout.homeDelivery')} <span className="text-[10px] bg-gray-100 text-muted px-1.5 py-0.5 rounded ml-1">{t('checkout.comingSoon')}</span></span>
              </div>
            </label>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-text font-bold text-sm uppercase tracking-wider mb-4">
            <span className="bg-primary text-white w-5 h-5 rounded-sm flex items-center justify-center text-xs">2</span>
            {t('checkout.paymentMethod')}
          </div>
          <div className="pl-7 space-y-3">
            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentOption === 'PayAtShop' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
              <input 
                type="radio" 
                name="payment" 
                value="PayAtShop"
                checked={paymentOption === 'PayAtShop'}
                onChange={() => setPaymentOption('PayAtShop')}
                className="w-4 h-4 text-primary focus:ring-primary" 
              />
              <div className="flex flex-col">
                <span className={`text-sm ${paymentOption === 'PayAtShop' ? 'font-bold text-text' : 'font-medium text-text'}`}>{t('checkout.payAtShop')}</span>
                <span className="text-xs text-muted">{t('checkout.cashOrUpi')}</span>
              </div>
            </label>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-bold text-text mb-2 border-b border-gray-100 pb-2">{t('cart.priceDetails')}</h3>
          <div className="flex justify-between text-text text-sm">
            <span>{t('cart.priceItems')} ({cart.length} {t('orders.items')})</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between text-secondary text-sm">
            <span>{t('cart.discount')}</span>
            <span>-₹{discount}</span>
          </div>
          <div className="flex justify-between text-text text-sm">
            <span>{t('cart.deliveryCharges')}</span>
            <span className="text-secondary">{t('cart.free')}</span>
          </div>
          <div className="border-t border-dashed border-gray-200 my-2 pt-2"></div>
          <div className="flex justify-between text-text font-bold text-lg">
            <span>{t('cart.totalAmount')}</span>
            <span>₹{finalTotal}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-40 max-w-md mx-auto shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
        >
          <div className="flex flex-col pl-2">
            <span className="text-sm text-muted font-medium">{t('cart.totalAmount')}</span>
            <span className="font-bold text-2xl text-text leading-none">₹{finalTotal}</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="bg-gradient-to-r from-secondary to-orange-500 text-white font-bold text-lg px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : t('checkout.placeOrder')}
          </motion.button>
        </motion.div>
        {/* Spacer for fixed bottom bar */}
        <div className="h-28"></div>
      </form>
    </motion.div>
  );
}
