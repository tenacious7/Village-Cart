import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ShopSettingsProvider } from './contexts/ShopSettingsContext';
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerHome from './pages/customer/Home';
import CustomerCart from './pages/customer/Cart';
import CustomerCheckout from './pages/customer/Checkout';
import CustomerOrders from './pages/customer/Orders';
import CustomerProfile from './pages/customer/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminInventory from './pages/admin/Inventory';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminHomeCustomization from './pages/admin/HomeCustomization';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ShopSettingsProvider>
        <CartProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes */}
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerHome />} />
                <Route path="cart" element={<CustomerCart />} />
                <Route path="checkout" element={<CustomerCheckout />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="home-customization" element={<AdminHomeCustomization />} />
              </Route>
            </Routes>
          </Router>
          </NotificationProvider>
        </CartProvider>
      </ShopSettingsProvider>
    </AuthProvider>
  </LanguageProvider>
  );
}
