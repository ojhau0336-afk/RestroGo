/* ═══════════════════════════════════════
   RESTROGO — data.js
   Shared demo data & storage utilities
═══════════════════════════════════════ */

const RG = {

  // ── Keys ──
  KEYS: {
    MENU:    'rg_menu',
    ORDERS:  'rg_orders',
    TABLES:  'rg_tables',
    RESET:   'rg_reset',
  },

  // ── BroadcastChannel for cross-tab sync ──
  ch: null,
  initChannel() {
    try { this.ch = new BroadcastChannel('restrogo'); } catch(e) { this.ch = null; }
  },
  broadcast(type, payload) {
    if (this.ch) this.ch.postMessage({ type, payload });
    // also fire storage event for fallback
  },

  // ── Storage helpers ──
  get(key)        { try { return JSON.parse(localStorage.getItem(key)); } catch{ return null; } },
  set(key, val)   { localStorage.setItem(key, JSON.stringify(val)); },
  update(key, fn) { const d = this.get(key); this.set(key, fn(d)); },

  // ── Order ID generator ──
  newOrderId() { return 'RG' + Date.now().toString(36).toUpperCase().slice(-5); },

  // ── Default menu ──
  defaultMenu() {
    return [
      // Starters
      { id:'m1',  cat:'Starters',     name:'Paneer Tikka',       desc:'Juicy marinated paneer grilled in tandoor',          price:199, img:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400', enabled:true },
      { id:'m2',  cat:'Starters',     name:'Veg Spring Rolls',   desc:'Crispy rolls stuffed with fresh veggies',            price:149, img:'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400', enabled:true },
      { id:'m3',  cat:'Starters',     name:'Chicken 65',         desc:'Spicy deep-fried chicken with curry leaves',         price:229, img:'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400', enabled:true },
      { id:'m4',  cat:'Starters',     name:'Samosa (2 pcs)',     desc:'Golden crispy samosas with mint chutney',            price:79,  img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', enabled:true },
      // Main Course
      { id:'m5',  cat:'Main Course',  name:'Butter Chicken',     desc:'Creamy tomato-based chicken curry',                  price:299, img:'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400', enabled:true },
      { id:'m6',  cat:'Main Course',  name:'Paneer Butter Masala',desc:'Rich & creamy paneer in makhani gravy',             price:259, img:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', enabled:true },
      { id:'m7',  cat:'Main Course',  name:'Dal Makhani',        desc:'Slow-cooked black lentils with butter & cream',      price:199, img:'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', enabled:true },
      { id:'m8',  cat:'Main Course',  name:'Palak Paneer',       desc:'Fresh spinach curry with soft paneer cubes',         price:229, img:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', enabled:true },
      // Biryani
      { id:'m9',  cat:'Biryani',      name:'Chicken Biryani',    desc:'Aromatic basmati rice with spiced chicken',          price:319, img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', enabled:true },
      { id:'m10', cat:'Biryani',      name:'Veg Biryani',        desc:'Fragrant basmati with seasonal vegetables',          price:249, img:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', enabled:true },
      { id:'m11', cat:'Biryani',      name:'Mutton Biryani',     desc:'Tender mutton pieces in spiced dum biryani',         price:379, img:'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400', enabled:true },
      // Beverages
      { id:'m12', cat:'Beverages',    name:'Mango Lassi',        desc:'Thick creamy mango yoghurt drink',                   price:89,  img:'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', enabled:true },
      { id:'m13', cat:'Beverages',    name:'Fresh Lime Soda',    desc:'Chilled lime soda — sweet or salted',                price:69,  img:'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400', enabled:true },
      { id:'m14', cat:'Beverages',    name:'Masala Chai',        desc:'Classic Indian spiced tea',                          price:49,  img:'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', enabled:true },
      // Desserts
      { id:'m15', cat:'Desserts',     name:'Gulab Jamun',        desc:'Soft milk dumplings in rose-cardamom syrup',         price:99,  img:'https://images.unsplash.com/photo-1601303516534-bf4c7b17b8b7?w=400', enabled:true },
      { id:'m16', cat:'Desserts',     name:'Kulfi',              desc:'Traditional Indian ice cream — pistachio & saffron', price:119, img:'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400', enabled:true },
    ];
  },

  // ── Default tables ──
  defaultTables() {
    return Array.from({length:8}, (_,i) => ({ id: i+1, label:`Table ${i+1}`, active:true }));
  },

  // ── Seed data if first run ──
  seed() {
    if (!this.get(this.KEYS.MENU))   this.set(this.KEYS.MENU,   this.defaultMenu());
    if (!this.get(this.KEYS.TABLES)) this.set(this.KEYS.TABLES, this.defaultTables());
    if (!this.get(this.KEYS.ORDERS)) this.set(this.KEYS.ORDERS, []);
  },

  // ── Reset all demo data ──
  resetAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
    this.seed();
    this.broadcast('RESET', {});
  },

  // ── Order helpers ──
  getOrders()   { return this.get(this.KEYS.ORDERS) || []; },
  saveOrders(o) { this.set(this.KEYS.ORDERS, o); this.broadcast('ORDERS_UPDATED', {}); },

  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
  },

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const idx    = orders.findIndex(o => o.id === orderId);
    if (idx > -1) {
      orders[idx].status    = status;
      orders[idx].updatedAt = Date.now();
      this.saveOrders(orders);
    }
  },

  getOrder(orderId) { return this.getOrders().find(o => o.id === orderId) || null; },

  // ── Menu helpers ──
  getMenu()     { return this.get(this.KEYS.MENU) || this.defaultMenu(); },
  saveMenu(m)   { this.set(this.KEYS.MENU, m); this.broadcast('MENU_UPDATED', {}); },

  // ── Table helpers ──
  getTables()   { return this.get(this.KEYS.TABLES) || this.defaultTables(); },
  saveTables(t) { this.set(this.KEYS.TABLES, t); },

  // ── Stats ──
  todayStats() {
    const today  = new Date().toDateString();
    const orders = this.getOrders().filter(o => new Date(o.createdAt).toDateString() === today);
    const sales  = orders.filter(o => o.status === 'delivered').reduce((s,o) => s + o.total, 0);
    const active = [...new Set(orders.filter(o => !['delivered','cancelled'].includes(o.status)).map(o => o.table))].length;
    const avg    = orders.length ? Math.round(orders.reduce((s,o) => s + o.total, 0) / orders.length) : 0;
    return { count: orders.length, sales, active, avg };
  },

  // ── Format helpers ──
  fmt: {
    price: n  => '₹' + Number(n).toLocaleString('en-IN'),
    time:  ts => new Date(ts).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
    date:  ts => new Date(ts).toLocaleDateString('en-IN'),
    ago:   ts => {
      const m = Math.floor((Date.now()-ts)/60000);
      if (m < 1)  return 'just now';
      if (m < 60) return m + ' min ago';
      return Math.floor(m/60) + ' hr ago';
    }
  },

  STATUS_LABELS: { placed:'Order Placed', preparing:'Preparing', ready:'Ready', delivered:'Delivered', cancelled:'Cancelled' },
  STATUS_COLORS: { placed:'#FFB21A', preparing:'#3b82f6', ready:'#12B76A', delivered:'#667085', cancelled:'#ef4444' },
};
