import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Camera, Loader2, Plus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { motion, AnimatePresence } from 'motion/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function Register() {
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [faceImage, setFaceImage] = useState<string | null>(null);
  
  // Form States
  const [fullName, setFullName] = useState(localStorage.getItem('lastFullName') || '');
  const [phone, setPhone] = useState(localStorage.getItem('lastPhone') || '');
  const [address, setAddress] = useState(localStorage.getItem('lastAddress') || '');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState(localStorage.getItem('lastShopName') || '');
  const [ownerName, setOwnerName] = useState(localStorage.getItem('lastOwnerName') || '');

  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to 0.7 quality to stay well under 1MB
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setFaceImage(compressedBase64);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const sanitizedPhone = phone.replace(/[^a-zA-Z0-9+]/g, '');
      const email = `${sanitizedPhone}@shop.com`;
      
      let user;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          try {
            // Try to sign in if the account already exists
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
          } catch (signInErr) {
            throw err; // Throw original error if sign in fails (e.g. wrong password)
          }
        } else {
          throw err;
        }
      }

      // Save user data to Firestore if it doesn't exist
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const userData = {
          uid: user.uid,
          role,
          phone,
          faceImage: faceImage || null, // Optional
          createdAt: serverTimestamp(),
          ...(role === 'customer' ? {
            fullName,
            address,
          } : {
            ownerName,
            shopName,
            village: address,
          })
        };
        await setDoc(userDocRef, userData);
      } else {
        // If the document exists, verify the role matches what they are trying to register as
        const existingData = userDocSnap.data();
        if (existingData.role !== role) {
          throw new Error(`An account with this phone number already exists as a ${existingData.role}. Please log in.`);
        }
      }

      localStorage.setItem('lastPhone', phone);
      if (role === 'customer') {
        localStorage.setItem('lastFullName', fullName);
        localStorage.setItem('lastAddress', address);
        navigate('/customer');
      } else {
        localStorage.setItem('lastOwnerName', ownerName);
        localStorage.setItem('lastShopName', shopName);
        localStorage.setItem('lastAddress', address);
        navigate('/admin');
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === 'auth/network-request-failed') {
        setError('Network error: Please check your internet connection or disable any adblockers/VPNs that might be blocking Firebase.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this phone number already exists. Please log in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid phone number.');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6 relative">
      <LanguageSwitcher />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="max-w-md w-full bg-card p-8 rounded-2xl shadow-md border border-gray-200 my-8"
      >
        <div className="flex justify-center mb-6">
          <AnimatePresence mode="wait">
            {role === 'customer' ? (
              <motion.div
                key="customer"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Bags.png" alt="Store" className="w-16 h-16 drop-shadow-md" />
              </motion.div>
            ) : (
              <motion.div
                key="admin"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked.png" alt="Admin" className="w-16 h-16 drop-shadow-md" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <h2 className="font-display text-3xl font-bold text-text text-center mb-2">{t('register.title')}</h2>
        <p className="text-center text-muted mb-8 font-medium">{t('register.areYou')}</p>
        
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8 relative">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${role === 'admin' ? 'translate-x-full left-0' : 'translate-x-0 left-1'}`}
          />
          <button 
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-3 rounded-lg font-bold text-base transition-colors relative z-10 ${role === 'customer' ? 'text-primary' : 'text-muted'}`}
          >
            {t('role.customer')}
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-3 rounded-lg font-bold text-base transition-colors relative z-10 ${role === 'admin' ? 'text-primary' : 'text-muted'}`}
          >
            {t('role.admin')}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold mb-4 text-center border border-red-100">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.form 
            key={role}
            initial={{ opacity: 0, x: role === 'customer' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: role === 'customer' ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegister} 
            className="space-y-4"
          >
            {/* Face Image Upload */}
            <div className="flex flex-col items-center mb-4">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                  {faceImage ? (
                    <img src={faceImage} alt="Face" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-gray-400 group-hover:text-primary transition-colors" size={32} />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
                <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-md">
                  <Plus size={16} />
                </div>
              </label>
              <span className="text-xs font-bold text-muted mt-2 uppercase tracking-wider">{t('form.faceImage')}</span>
            </div>

            {role === 'customer' ? (
              <>
                <input required type="text" autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t('form.fullName')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
                <input required type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('form.phone')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
                <input required type="text" autoComplete="street-address" value={address} onChange={e => setAddress(e.target.value)} placeholder={t('form.villageAddress')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
                <input required type="password" minLength={6} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('form.password')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
              </>
            ) : (
              <>
                <input required type="text" autoComplete="name" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder={t('form.ownerName')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
                <input required type="text" autoComplete="organization" value={shopName} onChange={e => setShopName(e.target.value)} placeholder={t('form.shopName')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
                <input required type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('form.phone')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
                <input required type="text" autoComplete="address-level3" value={address} onChange={e => setAddress(e.target.value)} placeholder={t('form.village')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
                <input required type="password" minLength={6} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('form.password')} className="w-full bg-gray-100 px-4 py-4 rounded-xl font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200" />
              </>
            )}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-xl py-4 rounded-xl shadow-lg hover:shadow-xl transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : t('register.button')}
            </motion.button>
          </motion.form>
        </AnimatePresence>
        
        <p className="text-center text-text mt-6 font-medium">
          {t('register.hasAccount')} <Link to="/login" className="text-secondary font-bold">{t('landing.login')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
