import React, { useState, useEffect } from 'react';
import { Package, Plus, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_village: string;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function AdminView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');

  // New Product Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Daily Ration');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto refresh orders
    return () => clearInterval(interval);
  }, []);

  const markAsReady = async (id: number) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Ready' })
    });
    fetchOrders();
  };

  const markAsDelivered = async (id: number) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Delivered' })
    });
    fetchOrders();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10)
      })
    });
    setName('');
    setPrice('');
    setQuantity('');
    alert('Product added successfully!');
  };

  return (
    <div className="min-h-screen bg-cream md:p-8 p-4">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm">
          <div>
            <h1 className="font-display text-3xl font-bold text-charcoal">Shop Dashboard</h1>
            <p className="text-muted">Manage your village store</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-2xl font-bold text-lg flex items-center gap-2 ${activeTab === 'orders' ? 'bg-saffron text-white shadow-md' : 'bg-cream text-charcoal'}`}
            >
              <Package size={24} /> Orders
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-3 rounded-2xl font-bold text-lg flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-saffron text-white shadow-md' : 'bg-cream text-charcoal'}`}
            >
              <Plus size={24} /> Add Inventory
            </button>
          </div>
        </header>

        {activeTab === 'orders' && (
          <div className="grid gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-cream flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-cream text-charcoal px-3 py-1 rounded-lg font-mono font-bold text-sm">#ORD-{order.id.toString().padStart(4, '0')}</span>
                    <span className={`px-3 py-1 rounded-lg font-bold text-sm flex items-center gap-1 ${
                      order.status === 'Pending' ? 'bg-secondary/10 text-secondary' : 
                      order.status === 'Ready' ? 'bg-primary/10 text-primary' : 
                      'bg-accent/20 text-text'
                    }`}>
                      {order.status === 'Pending' && <Clock size={16} />}
                      {order.status === 'Ready' && <Package size={16} />}
                      {order.status === 'Delivered' && <CheckCircle2 size={16} />}
                      {order.status}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-charcoal">{order.customer_name}</h3>
                  <p className="text-muted font-bold">{order.customer_phone} • {order.customer_village}</p>
                  
                  <div className="mt-4 bg-cream p-4 rounded-2xl">
                    <p className="font-bold text-sm text-muted mb-2">ITEMS:</p>
                    <ul className="space-y-1">
                      {order.items.map(item => (
                        <li key={item.id} className="text-charcoal font-medium">
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-4 w-full md:w-auto border-t md:border-t-0 border-cream pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-muted font-bold text-sm">TOTAL AMOUNT</p>
                    <p className="font-display text-4xl font-bold text-saffron flex items-center justify-end">
                      <IndianRupee size={28} /> {order.total_price}
                    </p>
                  </div>
                  
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => markAsReady(order.id)}
                      className="w-full md:w-auto bg-primary text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={24} /> Mark as Ready
                    </button>
                  )}
                  {order.status === 'Ready' && (
                    <button 
                      onClick={() => markAsDelivered(order.id)}
                      className="w-full md:w-auto bg-text text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-text/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={24} /> Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl">
                <Package size={64} className="mx-auto text-muted mb-4 opacity-50" />
                <h2 className="font-display text-2xl font-bold text-charcoal">No orders yet</h2>
                <p className="text-muted">Waiting for customers to place orders.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm max-w-2xl mx-auto border border-cream">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-muted mb-2">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-cream px-4 py-4 rounded-xl font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
                  placeholder="e.g. Tata Salt 1kg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-muted mb-2">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-cream px-4 py-4 rounded-xl font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
                >
                  <option>Daily Ration</option>
                  <option>Tea & Snacks</option>
                  <option>Home & Care</option>
                  <option>Hardware</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-muted mb-2">Price (₹)</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    step="0.5"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-cream px-4 py-4 rounded-xl font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted mb-2">Stock Quantity</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full bg-cream px-4 py-4 rounded-xl font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
                    placeholder="0"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-saffron text-white font-display font-bold text-xl py-4 rounded-2xl shadow-lg hover:bg-saffron/90 transition-colors mt-8"
              >
                Save Product
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
