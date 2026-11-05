/* ═══════════════════════════════════════
   RESTROGO — data.js
   Firebase Realtime Database version
═══════════════════════════════════════ */

// ── Firebase Config ──
const firebaseConfig = {
  apiKey:            "AIzaSyDF4UlBoVg28daeuaPhwnPjJOy3DUL1uOw",
  authDomain:        "restrogo-4c732.firebaseapp.com",
  projectId:         "restrogo-4c732",
  storageBucket:     "restrogo-4c732.firebasestorage.app",
  databaseURL:       "https://restrogo-4c732-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// ── Init Firebase ──
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const RG = {
  newOrderId() { return 'RG' + Date.now().toString(36).toUpperCase().slice(-5); },
  defaultMenu() {
    return [
      { id:'m1',  cat:'Starters',    name:'Paneer Tikka',        desc:'Juicy marinated paneer grilled in tandoor',          price:199, img:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400', enabled:true },
      { id:'m2',  cat:'Starters',    name:'Veg Spring Rolls',    desc:'Crispy rolls stuffed with fresh veggies',            price:149, img:'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400', enabled:true },
      { id:'m3',  cat:'Starters',    name:'Chicken 65',          desc:'Spicy deep-fried chicken with curry leaves',         price:229, img:'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400', enabled:true },
      { id:'m4',  cat:'Starters',    name:'Samosa (2 pcs)',      desc:'Golden crispy samosas with mint chutney',            price:79,  img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', enabled:true },
      { id:'m5',  cat:'Main Course', name:'Butter Chicken',      desc:'Creamy tomato-based chicken curry',                  price:299, img:'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400', enabled:true },
      { id:'m6',  cat:'Main Course', name:'Paneer Butter Masala',desc:'Rich & creamy paneer in makhani gravy',              price:259, img:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', enabled:true },
      { id:'m7',  cat:'Main Course', name:'Dal Makhani',         desc:'Slow-cooked black lentils with butter & cream',      price:199, img:'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', enabled:true },
      { id:'m8',  cat:'Main Course', name:'Palak Paneer',        desc:'Fresh spinach curry with soft paneer cubes',         price:229, img:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', enabled:true },
      { id:'m9',  cat:'Biryani',     name:'Chicken Biryani',     desc:'Aromatic basmati rice with spiced chicken',          price:319, img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', enabled:true },
      { id:'m10', cat:'Biryani',     name:'Veg Biryani',         desc:'Fragrant basmati with seasonal vegetables',          price:249, img:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', enabled:true },
      { id:'m11', cat:'Biryani',     name:'Mutton Biryani',      desc:'Tender mutton pieces in spiced dum biryani',         price:379, img:'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400', enabled:true },
      { id:'m12', cat:'Beverages',   name:'Mango Lassi',         desc:'Thick creamy mango yoghurt drink',                   price:89,  img:'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', enabled:true },
      { id:'m13', cat:'Beverages',   name:'Fresh Lime Soda',     desc:'Chilled lime soda — sweet or salted',                price:69,  img:'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400', enabled:true },
      { id:'m14', cat:'Beverages',   name:'Masala Chai',         desc:'Classic Indian spiced tea',                          price:49,  img:'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', enabled:true },
      { id:'m15', cat:'Desserts',    name:'Gulab Jamun',         desc:'Soft milk dumplings in rose-cardamom syrup',         price:99,  img:'https://images.unsplash.com/photo-1601303516534-bf4c7b17b8b7?w=400', enabled:true },
      { id:'m16', cat:'Desserts',    name:'Kulfi',               desc:'Traditional Indian ice cream — pistachio & saffron', price:119, img:'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400', enabled:true },
    ];
  },
  defaultTables() { return Array.from({length:8}, (_,i) => ({ id:i+1, label:`Table ${i+1}`, active:true })); },
  async seed() {
    const menuSnap = await db.ref('menu').once('value');
    if (!menuSnap.exists()) { const menuObj = {}; this.defaultMenu().forEach(item => { menuObj[item.id] = item; }); await db.ref('menu').set(menuObj); }
    const tablesSnap = await db.ref('tables').once('value');
    if (!tablesSnap.exists()) { const tablesObj = {}; this.defaultTables().forEach(t => { tablesObj[t.id] = t; }); await db.ref('tables').set(tablesObj); }
  },
  async resetAll() {
    await db.ref('orders').remove();
    const menuObj = {}; this.defaultMenu().forEach(item => { menuObj[item.id] = item; }); await db.ref('menu').set(menuObj);
    const tablesObj = {}; this.defaultTables().forEach(t => { tablesObj[t.id] = t; }); await db.ref('tables').set(tablesObj);
  },
  async addOrder(order) { await db.ref('orders/' + order.id).set(order); },
  async updateOrderStatus(orderId, status) { await db.ref('orders/' + orderId).update({ status, updatedAt: Date.now() }); },
  async getOrder(orderId) { const snap = await db.ref('orders/' + orderId).once('value'); return snap.val(); },
  async getOrders() { const snap = await db.ref('orders').once('value'); const val = snap.val() || {}; return Object.values(val).sort((a,b) => b.createdAt - a.createdAt); },
  onOrders(callback) { db.ref('orders').on('value', snap => { const val = snap.val() || {}; callback(Object.values(val).sort((a,b) => b.createdAt - a.createdAt)); }); return () => db.ref('orders').off('value'); },
  onOrder(orderId, callback) { db.ref('orders/' + orderId).on('value', snap => { callback(snap.val()); }); return () => db.ref('orders/' + orderId).off('value'); },
  async deleteOrder(orderId) { await db.ref('orders/' + orderId).remove(); },
  async getMenu() { const snap = await db.ref('menu').once('value'); return Object.values(snap.val() || {}); },
  async saveMenu(menuArray) { const menuObj = {}; menuArray.forEach(item => { menuObj[item.id] = item; }); await db.ref('menu').set(menuObj); },
  async saveMenuItem(item) { await db.ref('menu/' + item.id).set(item); },
  async deleteMenuItem(itemId) { await db.ref('menu/' + itemId).remove(); },
  onMenu(callback) { db.ref('menu').on('value', snap => { callback(Object.values(snap.val() || {})); }); return () => db.ref('menu').off('value'); },
  async getTables() { const snap = await db.ref('tables').once('value'); return Object.values(snap.val() || {}).sort((a,b) => a.id - b.id); },
  async saveTables(tablesArray) { const obj = {}; tablesArray.forEach(t => { obj[t.id] = t; }); await db.ref('tables').set(obj); },
  fmt: {
    price: n  => '₹' + Number(n).toLocaleString('en-IN'),
    time:  ts => new Date(ts).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
    date:  ts => new Date(ts).toLocaleDateString('en-IN'),
    ago:   ts => { const m = Math.floor((Date.now()-ts)/60000); if (m < 1) return 'just now'; if (m < 60) return m + ' min ago'; return Math.floor(m/60) + ' hr ago'; }
  },
  STATUS_LABELS: { placed:'Order Placed', preparing:'Preparing', ready:'Ready', delivered:'Delivered', cancelled:'Cancelled' },
  STATUS_COLORS: { placed:'#FFB21A', preparing:'#3b82f6', ready:'#12B76A', delivered:'#667085', cancelled:'#ef4444' },
};
