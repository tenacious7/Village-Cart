import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

const db = new Database('graamseva_v3.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_od TEXT,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT,
    is_loose BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_village TEXT NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity REAL,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (count.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name, name_od, category, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?)');
  insertProduct.run('Aashirvaad Atta 5kg', 'ଆଶୀର୍ବାଦ ଅଟା ୫ କିଲୋ', 'Daily Ration', 250, 20, 'https://loremflickr.com/200/200/flour,wheat');
  insertProduct.run('Tata Salt 1kg', 'ଟାଟା ଲୁଣ ୧ କିଲୋ', 'Daily Ration', 25, 50, 'https://loremflickr.com/200/200/salt');
  insertProduct.run('Parle-G Gold', 'ପାର୍ଲେ-ଜି ଗୋଲ୍ଡ', 'Tea & Snacks', 10, 100, 'https://loremflickr.com/200/200/biscuits');
  insertProduct.run('Brooke Bond Red Label', 'ବ୍ରୁକ୍ ବଣ୍ଡ ରେଡ୍ ଲେବଲ୍', 'Tea & Snacks', 120, 30, 'https://loremflickr.com/200/200/tea');
  insertProduct.run('Lifebuoy Soap', 'ଲାଇଫବୟ ସାବୁନ୍', 'Home & Care', 35, 60, 'https://loremflickr.com/200/200/soap');
  insertProduct.run('Surf Excel 1kg', 'ସର୍ଫ ଏକ୍ସେଲ ୧ କିଲୋ', 'Home & Care', 110, 25, 'https://loremflickr.com/200/200/detergent');
  insertProduct.run('LED Bulb 9W', 'ଏଲଇଡି ବଲ୍ବ ୯ ୱାଟ', 'Hardware', 90, 40, 'https://loremflickr.com/200/200/lightbulb');
  insertProduct.run('PVC Pipe 1 inch', 'ପିଭିସି ପାଇପ୍ ୧ ଇଞ୍ଚ', 'Hardware', 150, 15, 'https://loremflickr.com/200/200/pipe');
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  });

  app.post('/api/products', (req, res) => {
    const { name, name_od, category, price, quantity, image, is_loose } = req.body;
    const stmt = db.prepare('INSERT INTO products (name, name_od, category, price, quantity, image, is_loose) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(name, name_od, category, price, quantity, image || `https://picsum.photos/seed/${name}/200/200`, is_loose ? 1 : 0);
    io.emit('product:updated');
    res.json({ id: result.lastInsertRowid, name, name_od, category, price, quantity, image, is_loose });
  });

  app.put('/api/products/:id', (req, res) => {
    const { name, name_od, category, price, quantity, image, is_loose } = req.body;
    const stmt = db.prepare('UPDATE products SET name = ?, name_od = ?, category = ?, price = ?, quantity = ?, image = ?, is_loose = ? WHERE id = ?');
    stmt.run(name, name_od, category, price, quantity, image, is_loose ? 1 : 0, req.params.id);
    io.emit('product:updated');
    res.json({ success: true });
  });

  app.get('/api/orders', (req, res) => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    const ordersWithItems = orders.map((order: any) => {
      const items = db.prepare(`
        SELECT oi.*, p.name, p.is_loose 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `).all(order.id);
      return { ...order, items };
    });
    res.json(ordersWithItems);
  });

  app.post('/api/orders', (req, res) => {
    const { customer_name, customer_phone, customer_village, items, total_price } = req.body;
    
    const insertOrder = db.prepare('INSERT INTO orders (customer_name, customer_phone, customer_village, total_price) VALUES (?, ?, ?, ?)');
    const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
    
    const transaction = db.transaction(() => {
      const orderResult = insertOrder.run(customer_name, customer_phone, customer_village, total_price);
      const orderId = orderResult.lastInsertRowid;
      
      for (const item of items) {
        insertOrderItem.run(orderId, item.product_id, item.quantity, item.price);
        // Update stock
        db.prepare('UPDATE products SET quantity = quantity - ? WHERE id = ?').run(item.quantity, item.product_id);
      }
      return orderId;
    });

    try {
      const orderId = transaction();
      io.emit('product:updated');
      res.json({ success: true, orderId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to place order' });
    }
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
