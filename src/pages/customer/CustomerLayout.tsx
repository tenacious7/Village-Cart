import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, Package, User, Bell, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useShopSettings } from '../../contexts/ShopSettingsContext';
import { useCart } from '../../contexts/CartContext';

export default function CustomerLayout() {
  const location = useLocation();
  const path = location.pathname;
  const { t, language, setLanguage } = useLanguage();
  const { settings } = useShopSettings();
  const { cart } = useCart();

  const cartItemCount = cart.length;

  return (
    <div className="pb-24 max-w-md mx-auto bg-bg min-h-screen relative shadow-xl">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-blue-600 shadow-md px-4 py-4 flex justify-between items-center relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="flex items-center gap-3 relative z-10">
          {path === '/customer/cart' && (
            <Link to="/customer" className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors mr-1">
              <ArrowLeft size={24} />
            </Link>
          )}
          <div className="flex flex-col">
            <h1 className="font-display text-2xl font-bold text-white leading-none tracking-wide drop-shadow-sm">
              {path === '/customer/cart' ? t('cart.title') : (settings?.shopName || t('layout.shopName'))}
            </h1>
            {path !== '/customer/cart' && (
              <span className="text-[11px] text-white/90 font-medium mt-1">{settings?.shopAddress || t('layout.shopAddress')}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          {(path === '/customer' || path === '/customer/profile') && (
            <>
              <button 
                onClick={() => setLanguage(language === 'en' ? 'od' : 'en')}
                className="font-bold text-sm text-primary bg-white px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                {t('lang.' + language)}
              </button>
              <button className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Bell size={22} className="text-white" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary to-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-primary shadow-sm">2</span>
              </button>
            </>
          )}
        </div>
      </header>

      <main className="p-4">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      {path !== '/customer/cart' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center z-50 max-w-md mx-auto shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.15)]">
          <Link to="/customer" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${path === '/customer' ? 'text-primary bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Home size={26} className={path === '/customer' ? 'fill-primary/20' : ''} />
            <span className="text-[11px] font-bold">{t('nav.home')}</span>
          </Link>
          <Link to="/customer/cart" className={`flex flex-col items-center gap-1 p-2 rounded-xl relative transition-all ${path === '/customer/cart' ? 'text-primary bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>
            <div className="relative">
              <ShoppingCart size={26} className={path === '/customer/cart' ? 'fill-primary/20' : ''} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold">{t('nav.cart')}</span>
          </Link>
          <Link to="/customer/orders" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${path === '/customer/orders' ? 'text-primary bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Package size={26} className={path === '/customer/orders' ? 'fill-primary/20' : ''} />
            <span className="text-[11px] font-bold">{t('nav.orders')}</span>
          </Link>
          <Link to="/customer/profile" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${path === '/customer/profile' ? 'text-primary bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>
            <User size={26} className={path === '/customer/profile' ? 'fill-primary/20' : ''} />
            <span className="text-[11px] font-bold">{t('nav.profile')}</span>
          </Link>
        </nav>
      )}
    </div>
  );
}
