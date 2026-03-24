import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Bell, HelpCircle, LogOut, ChevronRight, Package, Heart, Wallet, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

export default function Profile() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { userData, loading, logout } = useAuth();

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
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center gap-4 mt-2 relative overflow-hidden">
        {userData?.faceImage ? (
          <img src={userData.faceImage} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-md relative z-10" />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center font-display text-2xl font-bold shadow-md relative z-10">
            {userData?.name?.charAt(0) || 'U'}
          </div>
        )}
        <div className="flex-1 relative z-10">
          <h3 className="font-bold text-lg text-text leading-tight">{userData?.name || t('profile.name')}</h3>
          <p className="text-muted text-sm mt-0.5">{userData?.phone || '+91 00000 00000'}</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} className="text-primary font-bold text-sm bg-white border border-blue-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">{t('profile.edit')}</motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <Link to="/customer/orders">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all h-full relative overflow-hidden">
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Package.png" alt="Orders" className="absolute -left-2 -bottom-2 w-12 h-12 opacity-30 drop-shadow-sm rotate-[-10deg]" />
            <div className="bg-blue-50 p-3 rounded-full text-primary mb-1 relative z-10">
              <Package size={24} />
            </div>
            <span className="font-bold text-sm text-text relative z-10">{t('profile.orders')}</span>
          </motion.div>
        </Link>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all w-full h-full relative overflow-hidden">
          <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" alt="Wishlist" className="absolute -right-2 -bottom-2 w-12 h-12 opacity-30 drop-shadow-sm rotate-[10deg]" />
          <div className="bg-red-50 p-3 rounded-full text-red-500 mb-1 relative z-10">
            <Heart size={24} />
          </div>
          <span className="font-bold text-sm text-text relative z-10">{t('profile.wishlist')}</span>
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h4 className="font-bold text-sm text-muted px-4 pt-4 pb-2 uppercase tracking-wider">{t('profile.accountSettings')}</h4>
        <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-text font-medium text-sm">
            <User size={20} className="text-primary" /> {t('profile.profileInfo')}
          </div>
          <ChevronRight size={20} className="text-muted" />
        </button>
        <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-text font-medium text-sm">
            <MapPin size={20} className="text-primary" /> {t('profile.addresses')}
          </div>
          <ChevronRight size={20} className="text-muted" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-text font-medium text-sm">
            <Wallet size={20} className="text-primary" /> {t('profile.savedCards')}
          </div>
          <ChevronRight size={20} className="text-muted" />
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h4 className="font-bold text-sm text-muted px-4 pt-4 pb-2 uppercase tracking-wider">{t('profile.myActivity')}</h4>
        <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-text font-medium text-sm">
            <Bell size={20} className="text-primary" /> {t('profile.notifications')}
          </div>
          <ChevronRight size={20} className="text-muted" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-text font-medium text-sm">
            <HelpCircle size={20} className="text-primary" /> {t('profile.help')}
          </div>
          <ChevronRight size={20} className="text-muted" />
        </button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-50 to-red-100 text-red-600 border border-red-200 font-bold text-base py-3.5 rounded-xl flex justify-center items-center gap-2 mt-6 shadow-sm hover:shadow-md transition-all"
        >
          <LogOut size={20} /> {t('profile.logout')}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
