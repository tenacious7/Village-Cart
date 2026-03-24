import { Link } from 'react-router-dom';
import { Package, Truck, IndianRupee, Store, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { motion } from 'motion/react';

export default function Landing() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-blue-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 -left-20 w-80 h-80 bg-accent rounded-full blur-3xl"
        />
      </div>
      
      <LanguageSwitcher />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-md w-full relative z-10"
      >
        <motion.div 
          variants={itemVariants}
          whileHover={{ rotate: 0, scale: 1.05 }}
          className="bg-white w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3 relative"
        >
          <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Bags.png" alt="Shopping Bags" className="w-20 h-20 drop-shadow-md" />
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="font-display text-4xl font-bold text-white mb-4 leading-tight whitespace-pre-line drop-shadow-md">
          {t('landing.title')}
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-white/90 mb-12 text-lg font-medium">
          {t('landing.subtitle')}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-12">
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-accent to-yellow-400 text-text font-bold text-xl py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {t('landing.getStarted')}
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white/10 text-white border border-white/30 font-bold text-xl py-4 rounded-xl backdrop-blur-sm"
            >
              {t('landing.login')}
            </motion.button>
          </Link>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-3 text-left">
          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg text-white"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Package.png" alt="Package" className="w-8 h-8 drop-shadow-sm" /></div>
            <span className="font-medium text-white">{t('landing.feature1')}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg text-white"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Delivery%20Truck.png" alt="Truck" className="w-8 h-8 drop-shadow-sm" /></div>
            <span className="font-medium text-white">{t('landing.feature2')}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg text-white"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Money%20Bag.png" alt="Money" className="w-8 h-8 drop-shadow-sm" /></div>
            <span className="font-medium text-white">{t('landing.feature3')}</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
