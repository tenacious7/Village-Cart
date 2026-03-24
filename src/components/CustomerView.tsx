import React, { useState, useEffect } from 'react';
import { ShoppingCart, Wheat, Coffee, Droplets, Wrench, Plus, Minus, X, CheckCircle2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItem extends Product {
  cartQuantity: number;
}

export default function CustomerView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Checkout form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.cartQuantity + delta;
        return newQ > 0 ? { ...item, cartQuantity: newQ } : item;
      }
      return item;
    }).filter(item => item.cartQuantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderData = {
      customer_name: name,
      customer_phone: phone,
      customer_village: village,
      total_price: cartTotal,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.cartQuantity,
        price: item.price
      }))
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        setCart([]);
        setIsCartOpen(false);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    { name: 'Daily Ration', icon: <Wheat size={40} />, color: 'bg-tertiary/20 text-tertiary' },
    { name: 'Tea & Snacks', icon: <Coffee size={40} />, color: 'bg-accent/20 text-accent' },
    { name: 'Home & Care', icon: <Droplets size={40} />, color: 'bg-secondary/20 text-secondary' },
    { name: 'Hardware', icon: <Wrench size={40} />, color: 'bg-primary/20 text-primary' },
  ];

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-6 text-center">
        <CheckCircle2 size={100} className="text-forest mb-6" />
        <h1 className="font-display text-4xl font-bold text-charcoal mb-2">Order Placed!</h1>
        <p className="text-lg text-muted mb-8">We will deliver it to {village} soon.</p>
        <button 
          onClick={() => setOrderSuccess(false)}
          className="bg-saffron text-white font-bold text-xl py-4 px-8 rounded-2xl w-full max-w-xs shadow-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 max-w-md mx-auto bg-bg min-h-screen relative shadow-xl">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-4 flex justify-between items-center rounded-b-2xl">
        <div className="flex items-center gap-2">
          <div className="bg-accent text-white p-2 rounded-xl">
            <Wheat size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary leading-none">Ma Tarini Grocery Shop</h1>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 bg-cream rounded-full"
        >
          <ShoppingCart size={28} className="text-charcoal" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <main className="p-4">
        {/* Categories Grid */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-display text-2xl font-bold text-charcoal">Categories</h2>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="text-accent font-bold text-sm">
                Show All
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-transform active:scale-95 ${cat.color} ${selectedCategory === cat.name ? 'ring-4 ring-offset-2 ring-accent' : ''}`}
                style={{ minHeight: '140px' }}
              >
                <div className="mb-3">{cat.icon}</div>
                <span className="font-display font-bold text-lg leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Products List */}
        <section>
          <h2 className="font-display text-2xl font-bold text-primary mb-4">
            {selectedCategory ? selectedCategory : 'All Items'}
          </h2>
          <div className="flex flex-col gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl bg-bg" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-primary leading-tight mb-1">{product.name}</h3>
                  <p className="text-sm text-muted mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-display font-bold text-2xl text-primary">₹{product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
                    >
                      <Plus size={24} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-text/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="p-4 border-b border-cream flex justify-between items-center">
              <h2 className="font-display text-2xl font-bold text-charcoal">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-cream rounded-full text-charcoal">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted">
                  <ShoppingCart size={64} className="mb-4 opacity-50" />
                  <p className="font-display text-xl">Your cart is empty</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-cream p-3 rounded-2xl">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h4 className="font-bold text-charcoal leading-tight">{item.name}</h4>
                        <p className="font-display font-bold text-accent">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-full p-1 shadow-sm">
                        <button onClick={() => updateCartQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-cream rounded-full text-charcoal">
                          <Minus size={16} strokeWidth={3} />
                        </button>
                        <span className="font-bold w-4 text-center">{item.cartQuantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-accent text-white rounded-full">
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 bg-white border-t border-cream shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleCheckout} className="flex flex-col gap-3 mb-4">
                  <input 
                    required
                    type="text" 
                    placeholder="Your Name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-cream px-4 py-4 rounded-xl font-bold text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-saffron"
                  />
                  <input 
                    required
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-cream px-4 py-4 rounded-xl font-bold text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-saffron"
                  />
                  <input 
                    required
                    type="text" 
                    placeholder="Village / Location" 
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full bg-cream px-4 py-4 rounded-xl font-bold text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-saffron"
                  />
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted font-bold">Total Amount:</span>
                    <span className="font-display text-3xl font-bold text-primary">₹{cartTotal}</span>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-secondary text-white font-display font-bold text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2"
                  >
                    Place Order (Cash on Delivery)
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
