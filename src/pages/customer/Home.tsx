import { useState, useEffect } from 'react';
import { Search, Plus, ShoppingCart, Layout, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useShopSettings } from '../../contexts/ShopSettingsContext';
import { toOdiaNumerals } from '../../utils/numberUtils';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

interface Product {
  id: string;
  name: string;
  name_od: string;
  category: string;
  price: number;
  image: string;
  is_loose?: boolean;
  quantity: number;
}

export default function Home() {
  const { t, language } = useLanguage();
  const { setCart } = useCart();
  const { settings, loading: settingsLoading } = useShopSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + (product.is_loose ? 0.25 : 1) } 
            : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        cartQuantity: product.is_loose ? 0.25 : 1, 
        image: product.image, 
        is_loose: !!product.is_loose 
      }];
    });
  };

  useEffect(() => {
    // Fetch Products
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => {
    const searchLower = search.toLowerCase();
    return p.name.toLowerCase().includes(searchLower) || 
           p.name_od.toLowerCase().includes(searchLower) ||
           p.category.toLowerCase().includes(searchLower);
  });

  const categories = [
    { name: t('cat.grocery'), icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Red%20Apple.png" alt="Grocery" className="w-10 h-10 drop-shadow-sm" />, color: 'bg-gradient-to-br from-blue-50 to-blue-100 text-primary border border-blue-200' },
    { name: t('cat.snacks'), icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Hamburger.png" alt="Snacks" className="w-10 h-10 drop-shadow-sm" />, color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-secondary border border-yellow-200' },
    { name: t('cat.oil'), icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Butter.png" alt="Oil" className="w-10 h-10 drop-shadow-sm" />, color: 'bg-gradient-to-br from-green-50 to-green-100 text-green-700 border border-green-200' },
    { name: t('cat.paan'), icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Leafy%20Green.png" alt="Paan" className="w-10 h-10 drop-shadow-sm" />, color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200' },
    { name: t('cat.drinks'), icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Cup%20with%20Straw.png" alt="Drinks" className="w-10 h-10 drop-shadow-sm" />, color: 'bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-700 border border-cyan-200' },
    { name: t('cat.veg'), icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Potato.png" alt="Vegetables" className="w-10 h-10 drop-shadow-sm" />, color: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 border border-amber-200' },
    { name: t('cat.care'), icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Soap.png" alt="Care" className="w-10 h-10 drop-shadow-sm" />, color: 'bg-gradient-to-br from-orange-50 to-orange-100 text-secondary border border-orange-200' },
    { name: t('cat.hardware'), icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wrench.png" alt="Hardware" className="w-10 h-10 drop-shadow-sm" />, color: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 border border-gray-200' },
  ];

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

  if (loading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sections = settings?.homeSections || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pb-6"
    >
      {/* Search Bar */}
      <div className="relative px-4 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 mx-4"></div>
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-muted z-10" size={20} />
        <input 
          type="text" 
          placeholder={t('home.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white pl-12 pr-4 py-3.5 rounded-xl font-medium text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-gray-100 relative z-10 transition-all"
        />
      </div>

      {/* Dynamic Sections */}
      <AnimatePresence>
        {sections.filter(s => s.active).sort((a, b) => a.order - b.order).map((section) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4"
          >
            {section.type === 'banner' && (
              <div className="bg-gradient-to-r from-primary via-blue-500 to-blue-400 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 w-2/3">
                  <h2 className="font-display text-3xl font-bold mb-2 leading-tight drop-shadow-sm">
                    {language === 'od' ? section.title_od : section.title}
                  </h2>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-accent to-yellow-400 text-text font-bold px-5 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    Shop Now
                  </motion.button>
                </div>
                <img src={section.content.image || "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Cart.png"} alt="Banner" className="absolute -right-4 -bottom-4 w-36 h-36 drop-shadow-2xl rotate-[-5deg]" />
              </div>
            )}

            {section.type === 'new_arrivals' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-display font-bold text-text">
                    {language === 'od' ? section.title_od : section.title}
                  </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                  {products.slice(0, 5).map(product => (
                    <motion.div 
                      key={product.id}
                      whileHover={{ y: -5 }}
                      className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 min-w-[160px] flex flex-col"
                    >
                      <img src={product.image} alt={product.name} className="w-full h-24 object-contain mb-2" />
                      <h3 className="text-sm font-bold text-text line-clamp-1">
                        {language === 'od' ? product.name_od : product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-primary">₹{product.price}</span>
                        <button onClick={() => addToCart(product)} className="bg-primary/10 p-1.5 rounded-full text-primary"><Plus size={16}/></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Categories */}
      <section className="bg-white py-4 px-4 shadow-sm">
        <h2 className="text-lg font-display font-bold text-text mb-4">Shop by Category</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex justify-between overflow-x-auto pb-2 hide-scrollbar gap-4"
        >
          {categories.map(cat => (
            <motion.button 
              key={cat.name} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 min-w-[72px]"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="font-medium text-[11px] text-text text-center leading-tight">{cat.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* All Products */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-display font-bold text-text">Popular Products</h2>
          <button className="text-primary text-sm font-bold bg-primary/10 px-3 py-1 rounded-full">View All</button>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {filteredProducts.map(product => (
            <motion.div 
              key={product.id} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all duration-200 relative overflow-hidden group"
            >
              <div className="absolute top-2 left-2 bg-accent text-text text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">
                BESTSELLER
              </div>
              <div className="aspect-square bg-gray-50 rounded-lg mb-3 p-2 flex items-center justify-center">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  src={product.image} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain mix-blend-multiply" 
                />
              </div>
              <h3 className="font-medium text-sm text-text leading-tight mb-1 line-clamp-2 flex-1">
                {language === 'od' ? product.name_od : product.name}
              </h3>
              <div className="flex items-center gap-1 mb-2">
                <div className="bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  4.5 ★
                </div>
                <span className="text-muted text-[10px]">(120)</span>
              </div>
              <div className="flex justify-between items-end mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-muted line-through">₹{language === 'od' ? toOdiaNumerals(product.price + 20) : product.price + 20}</span>
                  <span className="font-bold text-lg text-text leading-none flex items-baseline gap-1">
                    ₹{language === 'od' ? toOdiaNumerals(product.price) : product.price}
                    {product.is_loose && <span className="text-[10px] text-muted font-medium">/kg</span>}
                  </span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => addToCart(product)}
                  className="bg-gradient-to-br from-primary to-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  <Plus size={18} strokeWidth={3} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
