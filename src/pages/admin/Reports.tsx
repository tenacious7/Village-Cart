import { BarChart3, TrendingUp, Package, IndianRupee } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';

export default function AdminReports() {
  const { t } = useLanguage();

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
      className="space-y-6"
    >
      <motion.h2 variants={itemVariants} className="font-display text-3xl font-bold text-text">{t('reports.title')}</motion.h2>

      <motion.div variants={itemVariants} className="flex bg-gray-100 p-1 rounded-xl">
        <motion.button whileTap={{ scale: 0.95 }} className="flex-1 py-2 rounded-lg font-bold text-sm bg-white shadow-sm text-text">{t('reports.today')}</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className="flex-1 py-2 rounded-lg font-medium text-sm text-muted hover:text-text transition-colors">{t('reports.thisWeek')}</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className="flex-1 py-2 rounded-lg font-medium text-sm text-muted hover:text-text transition-colors">{t('reports.thisMonth')}</motion.button>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <p className="font-medium opacity-90 mb-1 relative z-10">{t('reports.totalRevenue')}</p>
        <h3 className="font-display text-5xl font-bold mb-4 relative z-10">₹8,420</h3>
        <div className="flex items-center gap-2 text-sm font-bold bg-white/20 w-fit px-3 py-1.5 rounded-lg relative z-10 backdrop-blur-sm">
          <TrendingUp size={16} /> {t('reports.fromYesterday')}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-2xl shadow-sm border border-blue-100">
          <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-3 shadow-sm">
            <Package size={20} />
          </div>
          <p className="text-muted font-medium text-sm">{t('reports.totalOrders')}</p>
          <p className="font-display text-3xl font-bold text-text">42</p>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-gradient-to-br from-white to-orange-50 p-5 rounded-2xl shadow-sm border border-orange-100">
          <div className="bg-secondary/10 w-10 h-10 rounded-xl flex items-center justify-center text-secondary mb-3 shadow-sm">
            <IndianRupee size={20} />
          </div>
          <p className="text-muted font-medium text-sm">{t('reports.avgOrderValue')}</p>
          <p className="font-display text-3xl font-bold text-text">₹200</p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-display text-xl font-bold text-text mb-4">{t('reports.topProducts')}</h3>
        <div className="space-y-4">
          {[
            { name: 'Rice 5kg', sold: 42, rev: 1680 },
            { name: 'Sugar 1kg', sold: 30, rev: 900 },
            { name: 'Lifebuoy Soap', sold: 28, rev: 560 },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg text-muted w-4">{i + 1}</span>
                <div>
                  <p className="font-bold text-text">{t(item.name)}</p>
                  <p className="text-xs text-muted font-medium">{item.sold} {t('reports.sold')}</p>
                </div>
              </div>
              <p className="font-display font-bold text-primary text-lg">₹{item.rev}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
