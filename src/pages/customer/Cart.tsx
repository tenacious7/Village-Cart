import { Minus, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { t } = useLanguage();
  const { cart, setCart, total } = useCart();

  const discount = 50; // Mock discount

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

  if (cart.length === 0) {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
      >
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="w-40 h-40 mb-8 relative"
        >
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 z-10"
          >
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Cart.png" alt="Empty Cart" className="w-full h-full drop-shadow-xl" />
          </motion.div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/10 rounded-[100%] blur-sm"></div>
        </motion.div>

        <motion.h2 variants={itemVariants} className="font-display text-2xl font-bold text-text mb-2">
          Your cart is empty
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted font-medium mb-8 max-w-[250px]">
          Looks like you haven't added anything to your cart yet.
        </motion.p>

        <motion.div variants={itemVariants} className="w-full">
          <Link to="/customer">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Start Shopping <ArrowRight size={20} />
            </motion.button>
          </Link>
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

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {cart.map(item => (
            <motion.div 
              key={item.id}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-text text-sm leading-tight mb-1 line-clamp-2">{t(item.name)}</h4>
                    <p className="text-xs text-muted">{t('cart.seller')}: {t('SuperMart')}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted line-through">₹{item.price + 20}</span>
                    <span className="font-bold text-text text-lg leading-none">₹{item.price} {item.is_loose && <span className="text-[10px] text-muted font-medium">/kg</span>}</span>
                    <span className="text-[#22C55E] text-xs font-bold">15% {t('cart.off')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {item.is_loose ? (
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => {
                          const step = item.unit === 'kg' ? 0.1 : 0.05;
                          const newQ = Math.max(step, item.cartQuantity - step);
                          setCart(cart.map(c => c.id === item.id ? { ...c, cartQuantity: newQ } : c));
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-text transition-colors hover:bg-gray-200"
                      >
                        <Minus size={16} />
                      </motion.button>
                      <div className="flex flex-col items-center justify-center min-w-[3rem]">
                        <span className="font-bold text-sm text-center">
                          {item.unit === 'kg' ? Number(item.cartQuantity.toFixed(2)) : Math.round(item.cartQuantity * 1000)}
                        </span>
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => {
                          const step = item.unit === 'kg' ? 0.1 : 0.05;
                          setCart(cart.map(c => c.id === item.id ? { ...c, cartQuantity: item.cartQuantity + step } : c));
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-text transition-colors hover:bg-gray-200"
                      >
                        <Plus size={16} />
                      </motion.button>
                      <select
                        value={item.unit || 'g'}
                        onChange={(e) => {
                          const newUnit = e.target.value;
                          setCart(cart.map(c => c.id === item.id ? { ...c, unit: newUnit } : c));
                        }}
                        className="p-1 ml-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-xs font-bold bg-gray-50 text-muted"
                      >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => {
                          if (item.cartQuantity > 1) {
                            setCart(cart.map(c => c.id === item.id ? { ...c, cartQuantity: item.cartQuantity - 1 } : c));
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-text transition-colors hover:bg-gray-200"
                      >
                        <Minus size={16} />
                      </motion.button>
                      <span className="font-bold text-sm w-4 text-center">{item.cartQuantity}</span>
                      <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => {
                          setCart(cart.map(c => c.id === item.id ? { ...c, cartQuantity: item.cartQuantity + 1 } : c));
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-text transition-colors hover:bg-gray-200"
                      >
                        <Plus size={16} />
                      </motion.button>
                    </>
                  )}
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                  className="flex items-center gap-1 text-muted hover:text-red-500 text-sm font-medium px-2 py-1 transition-colors"
                >
                  <Trash2 size={16} /> {t('cart.remove')}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <h3 className="font-bold text-text mb-2 border-b border-gray-100 pb-2">{t('cart.priceDetails')}</h3>
        <div className="flex justify-between text-text text-sm">
          <span>{t('cart.priceItems')} ({cart.length} {t('orders.items')})</span>
          <span>₹{total + discount}</span>
        </div>
        <div className="flex justify-between text-[#22C55E] text-sm">
          <span>{t('cart.discount')}</span>
          <span>-₹{discount}</span>
        </div>
        <div className="flex justify-between text-text text-sm">
          <span>{t('cart.deliveryCharges')}</span>
          <span className="text-[#22C55E] font-bold">{t('cart.free')}</span>
        </div>
        <div className="border-t border-dashed border-gray-200 my-2 pt-2"></div>
        <div className="flex justify-between text-text font-bold text-lg">
          <span>{t('cart.totalAmount')}</span>
          <span>₹{total}</span>
        </div>
        <div className="border-t border-dashed border-gray-200 my-2 pt-2"></div>
        <p className="text-[#22C55E] text-xs font-bold">{t('cart.saveAmount')} ₹{discount} {t('cart.onThisOrder')}</p>
      </motion.div>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 max-w-md mx-auto shadow-[0_-10px_20px_rgba(0,0,0,0.05)]"
      >
        <Link to="/customer/checkout" className="block w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#FFD814] text-black font-bold text-lg py-3.5 rounded-xl shadow-sm hover:bg-[#F7CA00] transition-colors flex items-center justify-center gap-2 border border-[#FCD200]"
          >
            {t('cart.placeOrder')} (₹{total})
          </motion.button>
        </Link>
      </motion.div>
      {/* Spacer for fixed bottom bar */}
      <div className="h-24"></div>
    </motion.div>
  );
}
