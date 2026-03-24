import { Store, User, Bell, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminSettings() {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 relative"
    >
      <LanguageSwitcher />
      <motion.h2 variants={itemVariants} className="font-display text-3xl font-bold text-text">{t('admin.settings.title')}</motion.h2>

      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-blue-100 relative overflow-hidden">
        <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Bags.png" alt="Shop" className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20" />
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center shadow-md relative z-10">
          <Store size={32} />
        </div>
        <div className="flex-1 relative z-10">
          <h3 className="font-display text-xl font-bold text-text">{t('admin.layout.shopName')}</h3>
          <p className="text-muted font-medium text-sm">+91 98765 43210</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-primary font-bold text-sm bg-white border border-blue-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">{t('profile.edit')}</motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <motion.button whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }} className="w-full flex items-center justify-between p-5 border-b border-gray-100 transition-colors">
          <div className="flex items-center gap-3 text-text font-bold">
            <User size={20} className="text-muted" /> {t('admin.settings.staff')}
          </div>
          <ChevronRight size={20} className="text-muted" />
        </motion.button>
        <motion.button whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }} className="w-full flex items-center justify-between p-5 border-b border-gray-100 transition-colors">
          <div className="flex items-center gap-3 text-text font-bold">
            <Bell size={20} className="text-muted" /> {t('admin.settings.notifications')}
          </div>
          <div className="w-10 h-6 bg-primary rounded-full relative">
            <motion.div layout className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></motion.div>
          </div>
        </motion.button>
        <motion.button whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }} className="w-full flex items-center justify-between p-5 transition-colors">
          <div className="flex items-center gap-3 text-text font-bold">
            <Store size={20} className="text-muted" /> {t('admin.settings.autoDiscount')}
          </div>
          <ChevronRight size={20} className="text-muted" />
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.button 
          onClick={handleLogout}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-red-50 to-red-100 text-red-600 border border-red-200 font-bold text-lg py-4 rounded-xl flex justify-center items-center gap-2 mt-8 shadow-sm hover:shadow-md transition-all"
        >
          <motion.div whileHover={{ x: -5 }}>
            <LogOut size={20} />
          </motion.div> {t('admin.settings.logout')}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
