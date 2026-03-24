import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Boxes, BarChart3, Settings, Bell, Layout } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useShopSettings } from '../../contexts/ShopSettingsContext';

export default function AdminLayout() {
  const location = useLocation();
  const path = location.pathname;
  const { t, language, setLanguage } = useLanguage();
  const { settings } = useShopSettings();

  return (
    <div className="min-h-screen bg-bg md:p-8 p-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-8 bg-gradient-to-r from-white to-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">
              {settings?.shopName || t('admin.layout.shopName')}
            </h1>
            <p className="text-muted font-medium text-sm">{t('admin.layout.dashboard')}</p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            {(path === '/admin' || path === '/admin/settings') && (
              <>
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'od' : 'en')}
                  className="font-bold text-sm text-primary bg-white shadow-sm px-4 py-2 rounded-lg hidden md:block border border-blue-100 hover:bg-blue-50 transition-colors"
                >
                  {t('lang.' + language)}
                </button>
                <button className="relative p-3 bg-white shadow-sm rounded-full hover:bg-blue-50 transition-colors border border-blue-100">
                  <Bell size={24} className="text-primary" />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary to-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">5</span>
                </button>
              </>
            )}
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav (Mobile) / Side Nav (Desktop could be added, but keeping bottom for simplicity) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 md:max-w-5xl md:mx-auto md:rounded-t-2xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <Link to="/admin" className={`flex flex-col items-center gap-1 transition-colors ${path === '/admin' ? 'text-primary' : 'text-muted'}`}>
          <LayoutDashboard size={24} className={path === '/admin' ? 'fill-primary/10' : ''} />
          <span className="text-[11px] font-bold">{t('admin.nav.dash')}</span>
        </Link>
        <Link to="/admin/orders" className={`flex flex-col items-center gap-1 transition-colors ${path === '/admin/orders' ? 'text-primary' : 'text-muted'}`}>
          <Package size={24} className={path === '/admin/orders' ? 'fill-primary/10' : ''} />
          <span className="text-[11px] font-bold">{t('admin.nav.orders')}</span>
        </Link>
        <Link to="/admin/inventory" className={`flex flex-col items-center gap-1 transition-colors ${path === '/admin/inventory' ? 'text-primary' : 'text-muted'}`}>
          <Boxes size={24} className={path === '/admin/inventory' ? 'fill-primary/10' : ''} />
          <span className="text-[11px] font-bold">{t('admin.nav.inventory')}</span>
        </Link>
        <Link to="/admin/home-customization" className={`flex flex-col items-center gap-1 transition-colors ${path === '/admin/home-customization' ? 'text-primary' : 'text-muted'}`}>
          <Layout size={24} className={path === '/admin/home-customization' ? 'fill-primary/10' : ''} />
          <span className="text-[11px] font-bold">Home</span>
        </Link>
        <Link to="/admin/reports" className={`flex flex-col items-center gap-1 transition-colors ${path === '/admin/reports' ? 'text-primary' : 'text-muted'}`}>
          <BarChart3 size={24} />
          <span className="text-[11px] font-bold">{t('admin.nav.reports')}</span>
        </Link>
        <Link to="/admin/settings" className={`flex flex-col items-center gap-1 transition-colors ${path === '/admin/settings' ? 'text-primary' : 'text-muted'}`}>
          <Settings size={24} />
          <span className="text-[11px] font-bold">{t('admin.nav.settings')}</span>
        </Link>
      </nav>
    </div>
  );
}
