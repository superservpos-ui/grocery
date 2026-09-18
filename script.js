/* =========================================================================
   FreshMart Grocery — script.js
   Frontend-only demo application. Uses vanilla JS + localStorage.
   NOTE (see section 31 of the brief / comments below): this is a DEMO.
   There is no real backend, no real authentication, and no real payment
   processing. A production grocery site would need a secure server,
   a real database, hashed-password authentication and a payment
   gateway (e.g. Stripe / PayHere) to process real orders and cards.
   ========================================================================= */

/* ============================ 1. STORAGE KEYS ============================ */
const KEYS = {
  products: 'freshmart_products',
  categories: 'freshmart_categories',
  cart: 'freshmart_cart',
  wishlist: 'freshmart_wishlist',
  users: 'freshmart_users',
  orders: 'freshmart_orders',
  messages: 'freshmart_messages',
  currentUser: 'freshmart_current_user',
  settings: 'freshmart_settings'
};

/* ============================ 2. SEED DATA ============================ */
const CATEGORY_META = [
  { name: 'Fruits & Vegetables', icon: 'fa-apple-whole' },
  { name: 'Dairy & Eggs',        icon: 'fa-cheese' },
  { name: 'Meat & Seafood',      icon: 'fa-drumstick-bite' },
  { name: 'Bakery',              icon: 'fa-bread-slice' },
  { name: 'Beverages',           icon: 'fa-bottle-water' },
  { name: 'Snacks',              icon: 'fa-cookie-bite' },
  { name: 'Rice & Grains',       icon: 'fa-wheat-awn' },
  { name: 'Household',           icon: 'fa-spray-can-sparkles' },
  { name: 'Personal Care',       icon: 'fa-pump-soap' },
  { name: 'Frozen Food',         icon: 'fa-snowflake' }
];

const SEED_CATEGORIES = CATEGORY_META.map((c, i) => ({
  id: i + 1,
  name: c.name,
  icon: c.icon,
  description: `Everyday essentials in ${c.name}.`
}));

const SEED_PRODUCTS = [
  // Fruits & Vegetables
  p(1,'Fresh Red Apples','Fruits & Vegetables',850,950,'1 kg',25,'Crisp, sweet apples imported and hand-picked for freshness.',true,4.5),
  p(2,'Ripe Bananas','Fruits & Vegetables',280,null,'1 kg (dozen)',40,'Locally grown Ambul bananas, naturally ripened.',false,4.3),
  p(3,'Vine Tomatoes','Fruits & Vegetables',320,380,'1 kg',18,'Juicy vine-ripened tomatoes, great for salads and curries.',true,4.2),
  // Dairy & Eggs
  p(4,'Full Cream Fresh Milk','Dairy & Eggs',420,null,'1 L',30,'Pasteurized full cream milk from local dairy farms.',true,4.6),
  p(5,'Cheddar Cheese Block','Dairy & Eggs',1250,1400,'200 g',12,'Aged cheddar cheese, sharp and creamy.',false,4.4),
  p(6,'Farm Fresh Eggs','Dairy & Eggs',680,null,'12 pcs',22,'Grade A eggs from free-range hens.',true,4.7),
  // Meat & Seafood
  p(7,'Chicken Breast Fillet','Meat & Seafood',980,1100,'500 g',15,'Skinless boneless chicken breast, farm raised.',true,4.5),
  p(8,'Fresh Prawns','Meat & Seafood',1650,1850,'500 g',8,'Deveined medium prawns, sourced daily.',false,4.3),
  p(9,'Beef Cubes','Meat & Seafood',1450,null,'500 g',10,'Tender beef cubes, perfect for curries and stews.',false,4.1),
  // Bakery
  p(10,'White Sandwich Bread','Bakery',210,null,'400 g loaf',35,'Soft, fresh-baked white bread, sliced.',false,4.2),
  p(11,'Butter Buns (6 pack)','Bakery',240,280,'6 pcs',28,'Soft buttery buns, baked fresh every morning.',true,4.4),
  p(12,'Chocolate Croissant','Bakery',180,null,'1 pc',20,'Flaky, buttery croissant filled with rich chocolate.',false,4.6),
  // Beverages
  p(13,'Fresh Orange Juice','Beverages',450,500,'1 L',24,'100% natural orange juice, no added sugar.',true,4.3),
  p(14,'Coca-Cola Bottle','Beverages',180,null,'1.5 L',50,'Classic Coca-Cola, chilled and ready to serve.',false,4.5),
  p(15,'Ceylon Black Tea','Beverages',620,700,'400 g',26,'Premium Ceylon tea leaves, rich aroma.',true,4.8),
  // Snacks
  p(16,'Potato Chips (Salted)','Snacks',260,null,'150 g',33,'Crispy salted potato chips, party pack.',false,4.0),
  p(17,'Marie Biscuits','Snacks',150,180,'200 g',45,'Light, crunchy tea-time biscuits.',false,4.1),
  p(18,'Milk Chocolate Bar','Snacks',320,null,'100 g',30,'Smooth and creamy milk chocolate.',true,4.7),
  // Rice & Grains
  p(19,'Basmati Rice','Rice & Grains',1450,1600,'5 kg',20,'Long grain aromatic basmati rice.',true,4.6),
  p(20,'Red Raw Rice','Rice & Grains',980,null,'5 kg',26,'Traditional Sri Lankan red rice, stone-free.',false,4.4),
  p(21,'Wheat Flour','Rice & Grains',540,600,'2 kg',32,'Fine wheat flour for bread, roti and short-eats.',false,4.2),
  // Household
  p(22,'Dish Washing Liquid','Household',380,null,'750 ml',27,'Grease-cutting dish soap with lemon extract.',false,4.3),
  p(23,'Laundry Detergent Powder','Household',890,980,'1 kg',19,'Powerful stain removal detergent powder.',true,4.5),
  p(24,'Soft Tissue Paper (6 rolls)','Household',420,null,'6 rolls',24,'2-ply soft tissue paper, extra absorbent.',false,4.2),
  // Personal Care
  p(25,'Herbal Shampoo','Personal Care',560,650,'400 ml',21,'Nourishing herbal shampoo for daily use.',false,4.4),
  p(26,'Moisturizing Soap Bar','Personal Care',150,null,'3 pack',38,'Gentle moisturizing soap for all skin types.',false,4.1),
  p(27,'Whitening Toothpaste','Personal Care',320,360,'150 g',29,'Fluoride toothpaste for stronger, whiter teeth.',true,4.5),
  // Frozen Food
  p(28,'Frozen Green Peas','Frozen Food',360,null,'500 g',17,'Flash-frozen peas, locking in freshness.',false,4.2),
  p(29,'Vanilla Ice Cream Tub','Frozen Food',780,850,'1 L',14,'Creamy classic vanilla ice cream.',true,4.7),
  p(30,'Frozen Fish Fillet','Frozen Food',1120,null,'500 g',0,'Cleaned and frozen seer fish fillets.',false,4.0)
];

function p(id,name,category,price,oldPrice,unit,stock,description,featured,rating){
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  return { id, name, category, price, oldPrice: oldPrice || null, discount, unit, stock, description, featured: !!featured, rating, image: imageFor(id, category) };
}

function imageFor(id, category){
  return `https://picsum.photos/seed/freshmart${id}/500/420`;
}

/* ============================ 3. STORAGE HELPERS ============================ */
function readLS(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch(e){
    console.warn('Storage read failed for', key, e);
    return fallback;
  }
}
function writeLS(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }catch(e){
    console.warn('Storage write failed for', key, e);
    toast('Could not save data on this device. Storage may be full.', true);
    return false;
  }
}

function loadProducts(){
  let items = readLS(KEYS.products, null);
  if(!items){ items = SEED_PRODUCTS; saveProducts(items); }
  return items;
}
function saveProducts(items){ writeLS(KEYS.products, items); }

function loadCategories(){
  let items = readLS(KEYS.categories, null);
  if(!items){ items = SEED_CATEGORIES; saveCategories(items); }
  return items;
}
function saveCategories(items){ writeLS(KEYS.categories, items); }

function loadCart(){ return readLS(KEYS.cart, []); }
function saveCart(items){ writeLS(KEYS.cart, items); }

function loadWishlist(){ return readLS(KEYS.wishlist, []); }
function saveWishlist(items){ writeLS(KEYS.wishlist, items); }

function loadUsers(){ return readLS(KEYS.users, []); }
function saveUsers(items){ writeLS(KEYS.users, items); }

function loadOrders(){ return readLS(KEYS.orders, []); }
function saveOrders(items){ writeLS(KEYS.orders, items); }

function loadMessages(){ return readLS(KEYS.messages, []); }
function saveMessages(items){ writeLS(KEYS.messages, items); }

function loadCurrentUser(){ return readLS(KEYS.currentUser, null); }
function saveCurrentUser(u){ writeLS(KEYS.currentUser, u); }

function loadSettings(){ return readLS(KEYS.settings, { deliveryFee: 300, freeDeliveryOver: 5000 }); }
function saveSettings(s){ writeLS(KEYS.settings, s); }

/* ============================ 4. APP STATE ============================ */
const state = {
  products: loadProducts(),
  categories: loadCategories(),
  cart: loadCart(),
  wishlist: loadWishlist(),
  currentUser: loadCurrentUser(),
  settings: loadSettings(),
  route: 'home',
  routeParams: {},
  shop: { category: 'All', minPrice: '', maxPrice: '', inStockOnly: false, minRating: 0, sort: 'default', query: '' },
  checkout: { step: 1, info: {}, address: {}, delivery: 'Standard Delivery', payment: 'Cash on Delivery' },
  admin: { section: 'dashboard' }
};

/* ============================ 5. UTILITIES ============================ */
function formatPrice(n){
  if(n === null || n === undefined) return '';
  return 'Rs. ' + Number(n).toLocaleString('en-LK', { maximumFractionDigits: 0 });
}

function genOrderNumber(){
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const orders = loadOrders();
  const todayCount = orders.filter(o => o.orderNumber.includes(ymd)).length + 1;
  return `FM-${ymd}-${String(todayCount).padStart(4,'0')}`;
}

function stockLabel(stock){
  if(stock <= 0) return { text: 'Out of Stock', cls: 'stock-out' };
  if(stock <= 10) return { text: `Only ${stock} left`, cls: 'stock-low' };
  return { text: 'In Stock', cls: 'stock-ok' };
}

function ratingStars(rating){
  return `<i class="fa-solid fa-star"></i> ${rating.toFixed(1)}`;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function toast(message, isError){
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i><span>${escapeHtml(message)}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; setTimeout(() => el.remove(), 250); }, 2600);
}

function handleImgError(imgEl, label){
  imgEl.onerror = null;
  const initials = (label || 'FreshMart').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='420'><rect width='100%' height='100%' fill='%23e7f2e9'/><text x='50%' y='50%' font-family='sans-serif' font-size='64' fill='%232c7a43' text-anchor='middle' dominant-baseline='middle'>${initials}</text></svg>`;
  imgEl.src = `data:image/svg+xml,${svg}`;
}

/* ============================ 6. HEADER / BADGES ============================ */
function updateBadges(){
  document.getElementById('cartBadge').textContent = state.cart.reduce((s,i) => s + i.qty, 0);
  document.getElementById('wishlistBadge').textContent = state.wishlist.length;
}

function updateAccountArea(){
  const area = document.getElementById('accountArea');
  if(state.currentUser){
    const isAdmin = state.currentUser.role === 'admin';
    area.innerHTML = `
      <div class="welcome-chip">
        <span>Welcome, ${escapeHtml(state.currentUser.fullName.split(' ')[0])}</span>
        <button class="btn btn-sm btn-outline" data-action="${isAdmin ? 'go-admin' : 'go-orders'}">${isAdmin ? 'Admin' : 'My Orders'}</button>
        <button class="btn btn-sm btn-ghost" data-action="logout">Logout</button>
      </div>`;
  } else {
    area.innerHTML = `<button class="btn btn-outline" id="loginBtn" data-action="open-login">Login</button>`;
  }
}

function setActiveNav(){
  document.querySelectorAll('.nav-inner a').forEach(a => {
    a.classList.toggle('active', a.dataset.route === state.route);
  });
}

/* ============================ 7. ROUTER ============================ */
function navigate(route, params){
  state.route = route;
  state.routeParams = params || {};
  if(route === 'admin' && !(state.currentUser && state.currentUser.role === 'admin')){
    renderAdminDenied();
    setActiveNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  render();
  setActiveNav();
  closeMobileMenus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render(){
  const app = document.getElementById('app');
  app.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  // simulate a very short load state for page/data transitions
  setTimeout(() => {
    switch(state.route){
      case 'home': app.innerHTML = renderHome(); break;
      case 'shop': app.innerHTML = renderShop(); bindShopEvents(); break;
      case 'categories': app.innerHTML = renderCategories(); break;
      case 'offers': app.innerHTML = renderOffers(); break;
      case 'about': app.innerHTML = renderAbout(); break;
      case 'contact': app.innerHTML = renderContact(); break;
      case 'cart': app.innerHTML = renderCart(); break;
      case 'wishlist': app.innerHTML = renderWishlist(); break;
      case 'checkout': app.innerHTML = renderCheckout(); bindCheckoutEvents(); break;
      case 'orders': app.innerHTML = renderMyOrders(); break;
      case 'admin': app.innerHTML = renderAdmin(); bindAdminEvents(); break;
      default: app.innerHTML = renderHome();
    }
    if(state.route === 'contact') bindContactForm();
    bindImageFallbacks();
  }, 120);
}

function bindImageFallbacks(){
  document.querySelectorAll('img[data-fallback-label]').forEach(img => {
    img.addEventListener('error', () => handleImgError(img, img.dataset.fallbackLabel), { once: true });
  });
}

function closeMobileMenus(){
  document.getElementById('mainNav').classList.remove('open');
  document.getElementById('overlay').classList.remove('visible');
}

/* ============================ 8. PRODUCT CARD COMPONENT ============================ */
function productCardHTML(prod){
  const stock = stockLabel(prod.stock);
  const inWishlist = state.wishlist.includes(prod.id);
  const cartLine = state.cart.find(c => c.id === prod.id);
  const qty = cartLine ? cartLine.qty : 1;
  return `
  <article class="product-card" data-id="${prod.id}">
    <div class="product-media" data-action="open-product" data-id="${prod.id}">
      ${prod.discount > 0 ? `<span class="discount-badge">-${prod.discount}%</span>` : ''}
      <button class="wishlist-toggle ${inWishlist ? 'active' : ''}" data-action="toggle-wishlist" data-id="${prod.id}" aria-label="Toggle wishlist">
        <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>
      </button>
      <img src="${prod.image}" alt="${escapeHtml(prod.name)}" data-fallback-label="${escapeHtml(prod.name)}" loading="lazy">
    </div>
    <div class="product-body">
      <span class="product-cat">${escapeHtml(prod.category)}</span>
      <span class="product-name" data-action="open-product" data-id="${prod.id}">${escapeHtml(prod.name)}</span>
      <span class="product-rating">${ratingStars(prod.rating)} &middot; ${prod.unit}</span>
      <div class="product-price-row">
        <span class="price-now">${formatPrice(prod.price)}</span>
        ${prod.oldPrice ? `<span class="price-old">${formatPrice(prod.oldPrice)}</span>` : ''}
      </div>
      <span class="stock-line ${stock.cls}">${stock.text}</span>
      <div class="product-actions">
        <div class="qty-stepper" data-qty-for="${prod.id}">
          <button type="button" data-action="qty-dec" data-id="${prod.id}" aria-label="Decrease quantity">−</button>
          <span data-qty-display="${prod.id}">${qty}</span>
          <button type="button" data-action="qty-inc" data-id="${prod.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="add-cart-btn" data-action="add-to-cart" data-id="${prod.id}" ${prod.stock <= 0 ? 'disabled' : ''}>
          <i class="fa-solid fa-cart-plus"></i> ${prod.stock <= 0 ? 'Unavailable' : 'Add'}
        </button>
      </div>
    </div>
  </article>`;
}

const pendingQty = {}; // transient per-product quantity selector state (product listings)
function getPendingQty(id){ return pendingQty[id] || 1; }

/* ============================ 9. HOME VIEW ============================ */
function renderHome(){
  const featured = state.products.filter(p => p.featured).slice(0, 8);
  const cats = state.categories;
  return `
  <section class="hero">
    <div class="container hero-inner">
      <div>
        <span class="hero-eyebrow">Groceries in Colombo &amp; beyond</span>
        <h1>Fresh Groceries Delivered to Your Door</h1>
        <p class="lede">Shop fresh fruits, vegetables, dairy, meat, beverages and everyday essentials at great prices.</p>
        <div class="hero-cta">
          <button class="btn btn-primary" data-action="navigate" data-route="shop">Shop Now</button>
          <button class="btn btn-outline" data-action="navigate" data-route="offers">View Offers</button>
        </div>
        <div class="hero-stats">
          <div><strong>${state.products.length}+</strong><span>Products</span></div>
          <div><strong>25+</strong><span>Delivery Areas</span></div>
          <div><strong>24/7</strong><span>Support</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="basket-graphic">
          <i class="fa-solid fa-basket-shopping"></i>
          <div class="produce-chip c1"><i class="fa-solid fa-apple-whole"></i> Fresh fruit</div>
          <div class="produce-chip c2"><i class="fa-solid fa-carrot"></i> Vegetables</div>
          <div class="produce-chip c3"><i class="fa-solid fa-cheese"></i> Dairy</div>
          <div class="produce-chip c4"><i class="fa-solid fa-bottle-water"></i> Beverages</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>Shop by Category</h2><p>Everything you need for the week, organized so it's easy to find.</p></div>
        <button class="btn btn-outline" data-action="navigate" data-route="categories">View All</button>
      </div>
      <div class="cat-grid">
        ${cats.map(categoryCardHTML).join('')}
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="promo-strip">
        <div>
          <h3>Weekend Special</h3>
          <p>Save on fresh produce, dairy and pantry essentials this weekend only.</p>
        </div>
        <div class="promo-badge">Up to 30% OFF</div>
        <button class="btn btn-mango" data-action="navigate" data-route="offers">Browse Offers</button>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>Featured Products</h2><p>Hand-picked favourites our customers keep coming back for.</p></div>
        <button class="btn btn-outline" data-action="navigate" data-route="shop">View All</button>
      </div>
      <div class="product-grid">
        ${featured.map(productCardHTML).join('')}
      </div>
    </div>
  </section>`;
}

function categoryCardHTML(cat){
  const count = state.products.filter(p => p.category === cat.name).length;
  return `
  <div class="cat-card" data-action="filter-category" data-cat="${escapeHtml(cat.name)}">
    <div class="cat-icon"><i class="fa-solid ${cat.icon}"></i></div>
    <h3>${escapeHtml(cat.name)}</h3>
    <span>${count} products</span>
  </div>`;
}

/* ============================ 10. CATEGORIES VIEW ============================ */
function renderCategories(){
  return `
  <section class="section">
    <div class="container">
      <div class="section-head"><div><h2>All Categories</h2><p>Browse groceries by department.</p></div></div>
      <div class="cat-grid">${state.categories.map(categoryCardHTML).join('')}</div>
    </div>
  </section>`;
}

/* ============================ 11. SHOP VIEW ============================ */
function getFilteredSortedProducts(){
  const f = state.shop;
  let items = state.products.slice();

  if(f.query && f.query.trim()){
    const q = f.query.trim().toLowerCase();
    items = items.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }
  if(f.category && f.category !== 'All'){
    items = items.filter(p => p.category === f.category);
  }
  if(f.minPrice !== '' && !isNaN(f.minPrice)){
    items = items.filter(p => p.price >= Number(f.minPrice));
  }
  if(f.maxPrice !== '' && !isNaN(f.maxPrice)){
    items = items.filter(p => p.price <= Number(f.maxPrice));
  }
  if(f.inStockOnly){
    items = items.filter(p => p.stock > 0);
  }
  if(f.minRating > 0){
    items = items.filter(p => p.rating >= f.minRating);
  }

  switch(f.sort){
    case 'price-asc': items.sort((a,b) => a.price - b.price); break;
    case 'price-desc': items.sort((a,b) => b.price - a.price); break;
    case 'name-asc': items.sort((a,b) => a.name.localeCompare(b.name)); break;
    case 'rating-desc': items.sort((a,b) => b.rating - a.rating); break;
    default: break; // default order
  }
  return items;
}

function renderShop(){
  const f = state.shop;
  const items = getFilteredSortedProducts();
  return `
  <section class="section" style="padding-top:32px;">
    <div class="container">
      <div class="section-head"><div><h2>Shop All Products</h2><p>Fresh groceries, everyday essentials.</p></div>
        <button class="btn btn-outline mobile-filter-btn" data-action="toggle-filters"><i class="fa-solid fa-sliders"></i> Filters</button>
      </div>
      <div class="shop-layout">
        <aside class="filter-panel" id="filterPanel">
          <button class="btn btn-ghost btn-sm mobile-only" data-action="toggle-filters" style="margin-bottom:14px;"><i class="fa-solid fa-xmark"></i> Close</button>
          <div class="filter-block">
            <h4>Categories</h4>
            <label><input type="radio" name="fcat" value="All" ${f.category==='All'?'checked':''}> All Categories</label>
            ${state.categories.map(c => `<label><input type="radio" name="fcat" value="${escapeHtml(c.name)}" ${f.category===c.name?'checked':''}> ${escapeHtml(c.name)}</label>`).join('')}
          </div>
          <div class="filter-block">
            <h4>Price Range (Rs.)</h4>
            <div class="price-range-row">
              <input type="number" id="minPriceInput" placeholder="Min" value="${f.minPrice}">
              <span>–</span>
              <input type="number" id="maxPriceInput" placeholder="Max" value="${f.maxPrice}">
            </div>
          </div>
          <div class="filter-block">
            <h4>Availability</h4>
            <label><input type="checkbox" id="inStockOnly" ${f.inStockOnly?'checked':''}> In Stock Only</label>
          </div>
          <div class="filter-block">
            <h4>Rating</h4>
            ${[4,3,0].map(r => `<label><input type="radio" name="frating" value="${r}" ${f.minRating===r?'checked':''}> ${r>0 ? r+'★ &amp; up' : 'Any rating'}</label>`).join('')}
          </div>
          <button class="btn btn-outline btn-block" data-action="reset-filters">Reset Filters</button>
        </aside>
        <div>
          <div class="shop-toolbar">
            <span>${items.length} product${items.length!==1?'s':''} found</span>
            <select id="sortSelect">
              <option value="default" ${f.sort==='default'?'selected':''}>Default</option>
              <option value="price-asc" ${f.sort==='price-asc'?'selected':''}>Price: Low to High</option>
              <option value="price-desc" ${f.sort==='price-desc'?'selected':''}>Price: High to Low</option>
              <option value="name-asc" ${f.sort==='name-asc'?'selected':''}>Name A-Z</option>
              <option value="rating-desc" ${f.sort==='rating-desc'?'selected':''}>Rating</option>
            </select>
          </div>
          ${items.length ? `<div class="product-grid">${items.map(productCardHTML).join('')}</div>` : emptyStateHTML('fa-magnifying-glass','No products found','Try adjusting your search or filters.')}
        </div>
      </div>
    </div>
  </section>`;
}

function emptyStateHTML(icon, title, text, btn){
  return `<div class="empty-state"><i class="fa-solid ${icon}"></i><h3>${title}</h3><p>${text}</p>${btn || ''}</div>`;
}

function bindShopEvents(){
  const minP = document.getElementById('minPriceInput');
  const maxP = document.getElementById('maxPriceInput');
  const stockChk = document.getElementById('inStockOnly');
  const sortSel = document.getElementById('sortSelect');
  if(minP) minP.addEventListener('input', () => { state.shop.minPrice = minP.value; refreshShopList(); });
  if(maxP) maxP.addEventListener('input', () => { state.shop.maxPrice = maxP.value; refreshShopList(); });
  if(stockChk) stockChk.addEventListener('change', () => { state.shop.inStockOnly = stockChk.checked; refreshShopList(); });
  if(sortSel) sortSel.addEventListener('change', () => { state.shop.sort = sortSel.value; refreshShopList(); });
  document.querySelectorAll('input[name=fcat]').forEach(r => r.addEventListener('change', () => { state.shop.category = r.value; refreshShopList(); }));
  document.querySelectorAll('input[name=frating]').forEach(r => r.addEventListener('change', () => { state.shop.minRating = Number(r.value); refreshShopList(); }));
}

function refreshShopList(){
  // Re-render only the shop view (keeps filter inputs' focus behaviour acceptable for a demo)
  document.getElementById('app').innerHTML = renderShop();
  bindShopEvents();
  bindImageFallbacks();
}

function resetShopFilters(){
  state.shop = { category: 'All', minPrice: '', maxPrice: '', inStockOnly: false, minRating: 0, sort: 'default', query: state.shop.query };
  refreshShopList();
}

/* ============================ 12. OFFERS VIEW ============================ */
function renderOffers(){
  const offers = state.products.filter(p => p.discount > 0).sort((a,b) => b.discount - a.discount);
  return `
  <section class="section">
    <div class="container">
      <div class="promo-strip" style="margin-bottom:34px;">
        <div><h3>Weekend Special</h3><p>Discounted groceries across every department — while stocks last.</p></div>
        <div class="promo-badge">Up to 30% OFF</div>
      </div>
      <div class="section-head"><div><h2>Current Offers</h2><p>${offers.length} discounted product${offers.length!==1?'s':''} right now.</p></div></div>
      ${offers.length ? `<div class="product-grid">${offers.map(productCardHTML).join('')}</div>` : emptyStateHTML('fa-tags','No offers right now','Check back soon for new deals.')}
    </div>
  </section>`;
}

/* ============================ 13. ABOUT VIEW ============================ */
function renderAbout(){
  return `
  <section class="about-hero">
    <div class="container">
      <h1>About FreshMart</h1>
      <p style="max-width:60ch;margin:0 auto;">FreshMart Grocery brings fresh produce, pantry staples and household essentials to your doorstep across Colombo and beyond — at honest, everyday prices.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-head"><div><h2>Why Choose Us</h2><p>What makes shopping with FreshMart easy.</p></div></div>
      <div class="why-grid">
        <div class="why-card"><i class="fa-solid fa-leaf"></i><h4>Fresh Products</h4><p>Sourced daily from trusted local farms and suppliers.</p></div>
        <div class="why-card"><i class="fa-solid fa-tag"></i><h4>Affordable Prices</h4><p>Everyday value with regular weekend offers.</p></div>
        <div class="why-card"><i class="fa-solid fa-truck-fast"></i><h4>Fast Delivery</h4><p>Same-day delivery across 25+ areas.</p></div>
        <div class="why-card"><i class="fa-solid fa-headset"></i><h4>Customer Support</h4><p>Friendly help whenever you need it, 24/7.</p></div>
      </div>
    </div>
  </section>
  <section class="section alt">
    <div class="container">
      <div class="stat-strip">
        <div><strong>10,000+</strong><span>Customers</span></div>
        <div><strong>5,000+</strong><span>Products</span></div>
        <div><strong>25+</strong><span>Delivery Areas</span></div>
        <div><strong>24/7</strong><span>Support</span></div>
      </div>
    </div>
  </section>`;
}

/* ============================ 14. CONTACT VIEW ============================ */
function renderContact(){
  return `
  <section class="section">
    <div class="container">
      <div class="section-head"><div><h2>Contact Us</h2><p>We'd love to hear from you.</p></div></div>
      <div class="contact-layout">
        <form id="contactForm" novalidate>
          <div class="form-group"><label for="cName">Name</label><input type="text" id="cName" required><span class="field-error" id="err-cName"></span></div>
          <div class="form-group"><label for="cEmail">Email</label><input type="email" id="cEmail" required><span class="field-error" id="err-cEmail"></span></div>
          <div class="form-group"><label for="cPhone">Phone</label><input type="tel" id="cPhone" required><span class="field-error" id="err-cPhone"></span></div>
          <div class="form-group"><label for="cMessage">Message</label><textarea id="cMessage" rows="5" required></textarea><span class="field-error" id="err-cMessage"></span></div>
          <button type="submit" class="btn btn-primary btn-block">Send Message</button>
        </form>
        <div class="contact-info-card">
          <h3>Get in Touch</h3>
          <p><i class="fa-solid fa-phone"></i> +94 11 234 5678</p>
          <p><i class="fa-solid fa-envelope"></i> hello@freshmart.lk</p>
          <p><i class="fa-solid fa-location-dot"></i> 42 Galle Road, Colombo 03, Sri Lanka</p>
          <p style="margin-top:18px;color:#cfe4d3;">Our store network delivers to 25+ areas across the Western Province.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function bindContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cName');
    const email = document.getElementById('cEmail');
    const phone = document.getElementById('cPhone');
    const message = document.getElementById('cMessage');
    let ok = true;
    ['cName','cEmail','cPhone','cMessage'].forEach(id => { document.getElementById('err-'+id).textContent = ''; });
    if(!name.value.trim()){ document.getElementById('err-cName').textContent = 'Please enter your name.'; ok = false; }
    if(!/^\S+@\S+\.\S+$/.test(email.value)){ document.getElementById('err-cEmail').textContent = 'Please enter a valid email.'; ok = false; }
    if(!phone.value.trim() || phone.value.trim().length < 7){ document.getElementById('err-cPhone').textContent = 'Please enter a valid phone number.'; ok = false; }
    if(!message.value.trim()){ document.getElementById('err-cMessage').textContent = 'Please enter a message.'; ok = false; }
    if(!ok) return;
    const messages = loadMessages();
    messages.push({ id: Date.now(), name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim(), message: message.value.trim(), date: new Date().toISOString() });
    saveMessages(messages);
    toast('Your message has been submitted.');
    form.reset();
  });
}

/* ============================ 15. CART VIEW & LOGIC ============================ */
function cartLineSubtotal(line){
  const prod = state.products.find(p => p.id === line.id);
  return prod ? prod.price * line.qty : 0;
}
function cartSubtotal(){
  return state.cart.reduce((s, l) => s + cartLineSubtotal(l), 0);
}
function cartDeliveryFee(){
  if(state.cart.length === 0) return 0;
  const sub = cartSubtotal();
  return sub >= state.settings.freeDeliveryOver ? 0 : state.settings.deliveryFee;
}
function cartDiscount(){
  return state.cart.reduce((s, l) => {
    const prod = state.products.find(p => p.id === l.id);
    if(!prod || !prod.oldPrice) return s;
    return s + (prod.oldPrice - prod.price) * l.qty;
  }, 0);
}
function cartTotal(){
  return cartSubtotal() + cartDeliveryFee();
}

function addToCart(productId, qty){
  const prod = state.products.find(p => p.id === productId);
  if(!prod){ toast('Product not found.', true); return; }
  if(prod.stock <= 0){ toast('This product is out of stock.', true); return; }
  qty = qty || 1;
  const existing = state.cart.find(l => l.id === productId);
  const currentQty = existing ? existing.qty : 0;
  if(currentQty + qty > prod.stock){
    toast(`Only ${prod.stock} in stock.`, true);
    qty = Math.max(0, prod.stock - currentQty);
    if(qty === 0) return;
  }
  if(existing){ existing.qty += qty; } else { state.cart.push({ id: productId, qty }); }
  saveCart(state.cart);
  updateBadges();
  toast('Product added to cart');
}

function removeFromCart(productId){
  state.cart = state.cart.filter(l => l.id !== productId);
  saveCart(state.cart);
  updateBadges();
  toast('Product removed from cart');
  if(state.route === 'cart') refreshCartView();
}

function updateCartQuantity(productId, qty){
  const prod = state.products.find(p => p.id === productId);
  const line = state.cart.find(l => l.id === productId);
  if(!line || !prod) return;
  if(qty <= 0){ removeFromCart(productId); return; }
  if(qty > prod.stock){ toast(`Only ${prod.stock} in stock.`, true); qty = prod.stock; }
  line.qty = qty;
  saveCart(state.cart);
  updateBadges();
  if(state.route === 'cart') refreshCartView();
}

function renderCart(){
  if(state.cart.length === 0){
    return `<section class="section">${emptyStateHTML('fa-basket-shopping','Your cart is empty','Start shopping and add your favorite groceries.', '<button class="btn btn-primary" data-action="navigate" data-route="shop">Shop Now</button>')}</section>`;
  }
  const lines = state.cart.map(line => {
    const prod = state.products.find(p => p.id === line.id);
    if(!prod) return '';
    return `
    <div class="cart-item" data-id="${prod.id}">
      <img src="${prod.image}" alt="${escapeHtml(prod.name)}" data-fallback-label="${escapeHtml(prod.name)}">
      <div>
        <h4>${escapeHtml(prod.name)}</h4>
        <span class="unit-price">${formatPrice(prod.price)} &middot; ${prod.unit}</span><br>
        <a href="#" class="remove-link" data-action="remove-cart" data-id="${prod.id}">Remove</a>
      </div>
      <div class="qty-stepper">
        <button type="button" data-action="cart-qty-dec" data-id="${prod.id}" aria-label="Decrease">−</button>
        <span>${line.qty}</span>
        <button type="button" data-action="cart-qty-inc" data-id="${prod.id}" aria-label="Increase">+</button>
      </div>
      <span class="line-subtotal">${formatPrice(cartLineSubtotal(line))}</span>
    </div>`;
  }).join('');

  return `
  <section class="section">
    <div class="container">
      <div class="section-head"><div><h2>Your Cart</h2><p>${state.cart.length} item${state.cart.length!==1?'s':''} in your cart.</p></div></div>
      <div class="cart-layout">
        <div>${lines}</div>
        <div class="summary-card">
          <h3>Order Summary</h3>
          <div class="summary-row"><span>Subtotal</span><span>${formatPrice(cartSubtotal())}</span></div>
          <div class="summary-row"><span>Delivery</span><span>${cartDeliveryFee() === 0 ? 'Free' : formatPrice(cartDeliveryFee())}</span></div>
          <div class="summary-row"><span>Discount</span><span>-${formatPrice(cartDiscount())}</span></div>
          <div class="summary-row total"><span>Total</span><span>${formatPrice(cartTotal())}</span></div>
          <button class="btn btn-primary btn-block" style="margin-top:14px;" data-action="go-checkout">Proceed to Checkout</button>
          <button class="btn btn-outline btn-block" style="margin-top:10px;" data-action="navigate" data-route="shop">Continue Shopping</button>
        </div>
      </div>
    </div>
  </section>`;
}

function refreshCartView(){
  document.getElementById('app').innerHTML = renderCart();
  bindImageFallbacks();
}

/* ============================ 16. WISHLIST VIEW & LOGIC ============================ */
function toggleWishlist(productId){
  const idx = state.wishlist.indexOf(productId);
  if(idx >= 0){ state.wishlist.splice(idx, 1); } else { state.wishlist.push(productId); }
  saveWishlist(state.wishlist);
  updateBadges();
  toast('Wishlist updated');
  rerenderCurrentView();
}

function renderWishlist(){
  const items = state.products.filter(p => state.wishlist.includes(p.id));
  if(items.length === 0){
    return `<section class="section">${emptyStateHTML('fa-heart','No items in your wishlist','Save products you love to find them here.', '<button class="btn btn-primary" data-action="navigate" data-route="shop">Shop Now</button>')}</section>`;
  }
  return `
  <section class="section">
    <div class="container">
      <div class="section-head"><div><h2>Your Wishlist</h2><p>${items.length} saved product${items.length!==1?'s':''}.</p></div></div>
      <div class="product-grid">${items.map(productCardHTML).join('')}</div>
    </div>
  </section>`;
}

function rerenderCurrentView(){
  // Re-render whichever view is currently active without a full navigate/scroll reset.
  const app = document.getElementById('app');
  switch(state.route){
    case 'home': app.innerHTML = renderHome(); break;
    case 'shop': app.innerHTML = renderShop(); bindShopEvents(); break;
    case 'offers': app.innerHTML = renderOffers(); break;
    case 'wishlist': app.innerHTML = renderWishlist(); break;
    case 'cart': app.innerHTML = renderCart(); break;
    default: return;
  }
  bindImageFallbacks();
}

/* ============================ 17. MODAL HELPERS ============================ */
function openModal(html, opts){
  const root = document.getElementById('modalRoot');
  const size = (opts && opts.large) ? ' modal-lg' : '';
  root.innerHTML = `<div class="modal${size} visible" role="dialog" aria-modal="true">${html}</div>`;
  document.getElementById('overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
  const modalEl = root.querySelector('.modal');
  const focusable = modalEl.querySelector('input, button, select, textarea');
  if(focusable) focusable.focus();
}

function closeModal(){
  document.getElementById('modalRoot').innerHTML = '';
  document.getElementById('overlay').classList.remove('visible');
  document.body.style.overflow = '';
}

function openConfirm(message, onConfirm){
  openModal(`
    <div class="modal-head"><h3>Please Confirm</h3><button class="modal-close" data-action="close-modal" aria-label="Close">&times;</button></div>
    <div class="modal-body">
      <p>${escapeHtml(message)}</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
        <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
        <button class="btn btn-danger" id="confirmYesBtn">Confirm</button>
      </div>
    </div>`);
  document.getElementById('confirmYesBtn').addEventListener('click', () => { closeModal(); onConfirm(); });
}

/* ============================ 18. PRODUCT DETAILS MODAL ============================ */
function openProductModal(productId){
  const prod = state.products.find(p => p.id === productId);
  if(!prod){ toast('Product not found.', true); return; }
  const stock = stockLabel(prod.stock);
  const inWishlist = state.wishlist.includes(prod.id);
  pendingQty[prod.id] = 1;
  openModal(`
    <div class="modal-head"><h3>Product Details</h3><button class="modal-close" data-action="close-modal" aria-label="Close">&times;</button></div>
    <div class="modal-body pd-grid">
      <div class="pd-image"><img src="${prod.image}" alt="${escapeHtml(prod.name)}" data-fallback-label="${escapeHtml(prod.name)}"></div>
      <div>
        <span class="product-cat">${escapeHtml(prod.category)}</span>
        <h2 style="margin-top:4px;">${escapeHtml(prod.name)}</h2>
        <span class="product-rating">${ratingStars(prod.rating)}</span>
        <p style="margin-top:12px;">${escapeHtml(prod.description || '')}</p>
        <div class="product-price-row" style="margin-bottom:6px;">
          <span class="price-now" style="font-size:24px;">${formatPrice(prod.price)}</span>
          ${prod.oldPrice ? `<span class="price-old">${formatPrice(prod.oldPrice)}</span>` : ''}
          ${prod.discount > 0 ? `<span class="discount-badge" style="position:static;">-${prod.discount}%</span>` : ''}
        </div>
        <p style="margin:0 0 6px;">Unit: <strong>${prod.unit}</strong></p>
        <span class="stock-line ${stock.cls}">${stock.text}</span>
        <div class="product-actions" style="margin-top:16px;">
          <div class="qty-stepper" id="pdQtyStepper">
            <button type="button" id="pdQtyDec">−</button>
            <span id="pdQtyDisplay">1</span>
            <button type="button" id="pdQtyInc">+</button>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="pdAddCart" ${prod.stock<=0?'disabled':''}><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
          <button class="btn btn-mango" id="pdBuyNow" ${prod.stock<=0?'disabled':''}>Buy Now</button>
          <button class="btn ${inWishlist ? 'btn-danger' : 'btn-outline'}" id="pdWishlist"><i class="fa-${inWishlist?'solid':'regular'} fa-heart"></i> ${inWishlist ? 'Saved' : 'Wishlist'}</button>
        </div>
      </div>
    </div>`, { large: true });

  document.getElementById('pdQtyDec').addEventListener('click', () => {
    pendingQty[prod.id] = Math.max(1, getPendingQty(prod.id) - 1);
    document.getElementById('pdQtyDisplay').textContent = pendingQty[prod.id];
  });
  document.getElementById('pdQtyInc').addEventListener('click', () => {
    pendingQty[prod.id] = Math.min(prod.stock || 1, getPendingQty(prod.id) + 1);
    document.getElementById('pdQtyDisplay').textContent = pendingQty[prod.id];
  });
  document.getElementById('pdAddCart').addEventListener('click', () => { addToCart(prod.id, getPendingQty(prod.id)); closeModal(); });
  document.getElementById('pdBuyNow').addEventListener('click', () => { addToCart(prod.id, getPendingQty(prod.id)); closeModal(); navigate('cart'); });
  document.getElementById('pdWishlist').addEventListener('click', () => { toggleWishlist(prod.id); closeModal(); });
  bindImageFallbacks();
}

/* ============================ 19. AUTH (DEMO ONLY) ============================ */
/* DEMO AUTHENTICATION NOTICE:
   Passwords are stored in plain text in localStorage for this frontend-only
   demo. This is NOT secure and must never be used in a real production
   system — a real site needs a server-side database with hashed
   passwords and proper session/token authentication. */
const ADMIN_EMAIL = 'admin@freshmart.com';
const ADMIN_PASSWORD = 'admin123';

function openAuthModal(tab){
  tab = tab || 'login';
  openModal(`
    <div class="modal-head"><h3>${tab === 'login' ? 'Login' : 'Create Account'}</h3><button class="modal-close" data-action="close-modal">&times;</button></div>
    <div class="modal-tabs">
      <button class="modal-tab ${tab==='login'?'active':''}" id="tabLogin">Login</button>
      <button class="modal-tab ${tab==='register'?'active':''}" id="tabRegister">Register</button>
    </div>
    <div class="modal-body" id="authBody"></div>`);
  renderAuthTab(tab);
  document.getElementById('tabLogin').addEventListener('click', () => { openAuthModal('login'); });
  document.getElementById('tabRegister').addEventListener('click', () => { openAuthModal('register'); });
}

function renderAuthTab(tab){
  const body = document.getElementById('authBody');
  if(tab === 'login'){
    body.innerHTML = `
      <form id="loginForm">
        <div class="form-group"><label for="loginEmail">Email</label><input type="email" id="loginEmail" required></div>
        <div class="form-group"><label for="loginPassword">Password</label><input type="password" id="loginPassword" required></div>
        <span class="field-error" id="loginError"></span>
        <button class="btn btn-primary btn-block" type="submit" style="margin-top:8px;">Login</button>
        <p style="margin-top:14px;font-size:12.5px;color:var(--ink-500);">Demo admin: admin@freshmart.com / admin123</p>
      </form>`;
    document.getElementById('loginForm').addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      loginUser(email, password);
    });
  } else {
    body.innerHTML = `
      <form id="registerForm">
        <div class="form-group"><label for="regName">Full Name</label><input type="text" id="regName" required></div>
        <div class="form-group"><label for="regEmail">Email</label><input type="email" id="regEmail" required></div>
        <div class="form-group"><label for="regPhone">Phone</label><input type="tel" id="regPhone" required></div>
        <div class="form-group"><label for="regPassword">Password</label><input type="password" id="regPassword" required></div>
        <div class="form-group"><label for="regConfirm">Confirm Password</label><input type="password" id="regConfirm" required></div>
        <span class="field-error" id="registerError"></span>
        <button class="btn btn-primary btn-block" type="submit" style="margin-top:8px;">Register</button>
      </form>`;
    document.getElementById('registerForm').addEventListener('submit', e => {
      e.preventDefault();
      registerUser({
        fullName: document.getElementById('regName').value.trim(),
        email: document.getElementById('regEmail').value.trim().toLowerCase(),
        phone: document.getElementById('regPhone').value.trim(),
        password: document.getElementById('regPassword').value,
        confirm: document.getElementById('regConfirm').value
      });
    });
  }
}

function loginUser(email, password){
  const errEl = document.getElementById('loginError');
  if(!email || !password){ errEl.textContent = 'Please enter your email and password.'; return; }

  if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
    state.currentUser = { fullName: 'Admin', email: ADMIN_EMAIL, role: 'admin' };
    saveCurrentUser(state.currentUser);
    updateAccountArea();
    closeModal();
    toast('Login successful');
    navigate('admin');
    return;
  }

  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if(!user || user.password !== password){
    errEl.textContent = 'Invalid email or password.';
    return;
  }
  state.currentUser = { fullName: user.fullName, email: user.email, role: 'customer' };
  saveCurrentUser(state.currentUser);
  updateAccountArea();
  closeModal();
  toast('Login successful');
  rerenderCurrentView();
}

function registerUser(data){
  const errEl = document.getElementById('registerError');
  if(!data.fullName || !data.email || !data.phone || !data.password){ errEl.textContent = 'Please fill in all fields.'; return; }
  if(!/^\S+@\S+\.\S+$/.test(data.email)){ errEl.textContent = 'Please enter a valid email.'; return; }
  if(data.password.length < 6){ errEl.textContent = 'Password must be at least 6 characters.'; return; }
  if(data.password !== data.confirm){ errEl.textContent = 'Passwords do not match.'; return; }
  const users = loadUsers();
  if(users.some(u => u.email === data.email) || data.email === ADMIN_EMAIL){ errEl.textContent = 'An account with this email already exists.'; return; }
  const newUser = { fullName: data.fullName, email: data.email, phone: data.phone, password: data.password, registeredAt: new Date().toISOString() };
  users.push(newUser);
  saveUsers(users);
  state.currentUser = { fullName: newUser.fullName, email: newUser.email, role: 'customer' };
  saveCurrentUser(state.currentUser);
  updateAccountArea();
  closeModal();
  toast('Registration successful. Welcome!');
  rerenderCurrentView();
}

function logoutUser(){
  state.currentUser = null;
  saveCurrentUser(null);
  updateAccountArea();
  toast('You have been logged out');
  navigate('home');
}

/* ============================ 20. CHECKOUT FLOW ============================ */
const DISTRICTS = ['Colombo','Gampaha','Kalutara','Kandy','Galle','Matara','Jaffna','Kurunegala','Anuradhapura','Ratnapura'];

function goCheckout(){
  if(state.cart.length === 0){ toast('Your cart is empty.', true); return; }
  if(!state.currentUser){ openAuthModal('login'); toast('Please login to checkout.', true); return; }
  state.checkout = {
    step: 1,
    info: { fullName: state.currentUser.fullName || '', phone: '', email: state.currentUser.email || '' },
    address: { house: '', street: '', city: '', district: DISTRICTS[0], postal: '' },
    delivery: 'Standard Delivery',
    payment: 'Cash on Delivery',
    card: {}
  };
  navigate('checkout');
}

function renderCheckout(){
  if(state.cart.length === 0){
    return `<section class="section">${emptyStateHTML('fa-basket-shopping','Your cart is empty','Add products before checking out.', '<button class="btn btn-primary" data-action="navigate" data-route="shop">Shop Now</button>')}</section>`;
  }
  const c = state.checkout;
  const stepNames = ['Customer Info','Delivery Address','Delivery Method','Payment','Review'];
  return `
  <section class="section">
    <div class="container" style="max-width:820px;">
      <h2 style="margin-bottom:20px;">Checkout</h2>
      <div class="checkout-steps">
        ${stepNames.map((name,i) => `<div class="step-pill ${c.step===i+1?'active':(c.step>i+1?'done':'')}">${i+1}. ${name}</div>`).join('')}
      </div>
      <div id="checkoutStepBody">${renderCheckoutStep()}</div>
    </div>
  </section>`;
}

function renderCheckoutStep(){
  const c = state.checkout;
  if(c.step === 1){
    return `
      <div class="form-grid">
        <div class="form-group"><label for="coName">Full Name</label><input type="text" id="coName" value="${escapeHtml(c.info.fullName)}"><span class="field-error" id="err-coName"></span></div>
        <div class="form-group"><label for="coPhone">Phone</label><input type="tel" id="coPhone" value="${escapeHtml(c.info.phone)}"><span class="field-error" id="err-coPhone"></span></div>
        <div class="form-group full"><label for="coEmail">Email</label><input type="email" id="coEmail" value="${escapeHtml(c.info.email)}"><span class="field-error" id="err-coEmail"></span></div>
      </div>
      <div class="checkout-nav"><span></span><button class="btn btn-primary" id="step1Next">Continue</button></div>`;
  }
  if(c.step === 2){
    return `
      <div class="form-grid">
        <div class="form-group"><label for="coHouse">House / Building</label><input type="text" id="coHouse" value="${escapeHtml(c.address.house)}"><span class="field-error" id="err-coHouse"></span></div>
        <div class="form-group"><label for="coStreet">Street</label><input type="text" id="coStreet" value="${escapeHtml(c.address.street)}"><span class="field-error" id="err-coStreet"></span></div>
        <div class="form-group"><label for="coCity">City</label><input type="text" id="coCity" value="${escapeHtml(c.address.city)}"><span class="field-error" id="err-coCity"></span></div>
        <div class="form-group"><label for="coDistrict">District</label>
          <select id="coDistrict">${DISTRICTS.map(d => `<option ${c.address.district===d?'selected':''}>${d}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label for="coPostal">Postal Code</label><input type="text" id="coPostal" value="${escapeHtml(c.address.postal)}"><span class="field-error" id="err-coPostal"></span></div>
      </div>
      <div class="checkout-nav"><button class="btn btn-ghost" id="stepBack">Back</button><button class="btn btn-primary" id="step2Next">Continue</button></div>`;
  }
  if(c.step === 3){
    const options = [
      { name: 'Standard Delivery', icon: 'fa-truck', note: '2-3 days' },
      { name: 'Express Delivery', icon: 'fa-bolt', note: 'Same day' },
      { name: 'Store Pickup', icon: 'fa-store', note: 'Pickup today' }
    ];
    return `
      <div class="radio-cards">${options.map(o => `
        <div class="radio-card ${c.delivery===o.name?'selected':''}" data-delivery="${o.name}">
          <i class="fa-solid ${o.icon}"></i><strong>${o.name}</strong><br><span style="font-size:12.5px;color:var(--ink-500);">${o.note}</span>
        </div>`).join('')}</div>
      <div class="checkout-nav"><button class="btn btn-ghost" id="stepBack">Back</button><button class="btn btn-primary" id="step3Next">Continue</button></div>`;
  }
  if(c.step === 4){
    const options = [
      { name: 'Cash on Delivery', icon: 'fa-money-bill-wave' },
      { name: 'Card', icon: 'fa-credit-card' },
      { name: 'Online Payment', icon: 'fa-globe' }
    ];
    return `
      <div class="radio-cards">${options.map(o => `
        <div class="radio-card ${c.payment===o.name?'selected':''}" data-payment="${o.name}">
          <i class="fa-solid ${o.icon}"></i><strong>${o.name}</strong>
        </div>`).join('')}</div>
      <div id="paymentExtra" style="margin-top:18px;">${c.payment !== 'Cash on Delivery' ? demoPaymentFormHTML() : ''}</div>
      <div class="checkout-nav"><button class="btn btn-ghost" id="stepBack">Back</button><button class="btn btn-primary" id="step4Next">Continue</button></div>`;
  }
  // step 5: review
  const sub = cartSubtotal(), fee = cartDeliveryFee(), disc = cartDiscount(), total = cartTotal();
  const lines = state.cart.map(l => {
    const prod = state.products.find(p => p.id === l.id);
    return `<div class="review-line"><span>${escapeHtml(prod.name)} × ${l.qty}</span><span>${formatPrice(cartLineSubtotal(l))}</span></div>`;
  }).join('');
  return `
    <h4 style="margin-bottom:10px;">Order Review</h4>
    ${lines}
    <div class="review-line"><span>Subtotal</span><span>${formatPrice(sub)}</span></div>
    <div class="review-line"><span>Delivery (${escapeHtml(c.delivery)})</span><span>${fee===0?'Free':formatPrice(fee)}</span></div>
    <div class="review-line"><span>Discount</span><span>-${formatPrice(disc)}</span></div>
    <div class="review-line" style="font-weight:800;border-bottom:none;font-size:17px;"><span>Total</span><span>${formatPrice(total)}</span></div>
    <p style="margin-top:14px;font-size:13.5px;">Deliver to: ${escapeHtml(c.address.house)}, ${escapeHtml(c.address.street)}, ${escapeHtml(c.address.city)}, ${escapeHtml(c.address.district)} ${escapeHtml(c.address.postal)}</p>
    <p style="font-size:13.5px;">Payment: ${escapeHtml(c.payment)}</p>
    <div class="checkout-nav"><button class="btn btn-ghost" id="stepBack">Back</button><button class="btn btn-mango" id="placeOrderBtn">Place Order</button></div>`;
}

function demoPaymentFormHTML(){
  return `
    <div class="form-grid">
      <div class="form-group full"><label>Card Number (demo only)</label><input type="text" maxlength="19" placeholder="4111 1111 1111 1111" id="cardNumber"></div>
      <div class="form-group"><label>Expiry</label><input type="text" placeholder="MM/YY" id="cardExpiry"></div>
      <div class="form-group"><label>CVV</label><input type="text" maxlength="4" placeholder="123" id="cardCvv"></div>
    </div>
    <p style="font-size:12.5px;color:var(--ink-500);">Demo payment form only — no real payment is processed and no real card data is stored.</p>`;
}

function bindCheckoutEvents(){
  const c = state.checkout;
  const backBtn = document.getElementById('stepBack');
  if(backBtn) backBtn.addEventListener('click', () => { c.step -= 1; refreshCheckoutStep(); });

  if(c.step === 1){
    document.getElementById('step1Next').addEventListener('click', () => {
      const name = document.getElementById('coName').value.trim();
      const phone = document.getElementById('coPhone').value.trim();
      const email = document.getElementById('coEmail').value.trim();
      let ok = true;
      ['coName','coPhone','coEmail'].forEach(id => document.getElementById('err-'+id).textContent = '');
      if(!name){ document.getElementById('err-coName').textContent = 'Full name is required.'; ok = false; }
      if(!phone || phone.length < 7){ document.getElementById('err-coPhone').textContent = 'Valid phone is required.'; ok = false; }
      if(!/^\S+@\S+\.\S+$/.test(email)){ document.getElementById('err-coEmail').textContent = 'Valid email is required.'; ok = false; }
      if(!ok) return;
      c.info = { fullName: name, phone, email };
      c.step = 2; refreshCheckoutStep();
    });
  }
  if(c.step === 2){
    document.getElementById('step2Next').addEventListener('click', () => {
      const house = document.getElementById('coHouse').value.trim();
      const street = document.getElementById('coStreet').value.trim();
      const city = document.getElementById('coCity').value.trim();
      const district = document.getElementById('coDistrict').value;
      const postal = document.getElementById('coPostal').value.trim();
      let ok = true;
      ['coHouse','coStreet','coCity','coPostal'].forEach(id => document.getElementById('err-'+id).textContent = '');
      if(!house){ document.getElementById('err-coHouse').textContent = 'Required.'; ok = false; }
      if(!street){ document.getElementById('err-coStreet').textContent = 'Required.'; ok = false; }
      if(!city){ document.getElementById('err-coCity').textContent = 'Required.'; ok = false; }
      if(!postal){ document.getElementById('err-coPostal').textContent = 'Required.'; ok = false; }
      if(!ok) return;
      c.address = { house, street, city, district, postal };
      c.step = 3; refreshCheckoutStep();
    });
  }
  if(c.step === 3){
    document.querySelectorAll('[data-delivery]').forEach(card => card.addEventListener('click', () => { c.delivery = card.dataset.delivery; refreshCheckoutStep(); }));
    document.getElementById('step3Next').addEventListener('click', () => { c.step = 4; refreshCheckoutStep(); });
  }
  if(c.step === 4){
    document.querySelectorAll('[data-payment]').forEach(card => card.addEventListener('click', () => { c.payment = card.dataset.payment; refreshCheckoutStep(); }));
    document.getElementById('step4Next').addEventListener('click', () => {
      if(c.payment !== 'Cash on Delivery'){
        const num = document.getElementById('cardNumber');
        if(num && num.value.replace(/\s/g,'').length < 12){ toast('Please enter a valid demo card number.', true); return; }
      }
      c.step = 5; refreshCheckoutStep();
    });
  }
  if(c.step === 5){
    document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
  }
}

function refreshCheckoutStep(){
  document.getElementById('app').innerHTML = renderCheckout();
  bindCheckoutEvents();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================ 21. PLACE ORDER ============================ */
function placeOrder(){
  const c = state.checkout;
  const order = {
    orderNumber: genOrderNumber(),
    date: new Date().toISOString(),
    customer: c.info,
    address: c.address,
    products: state.cart.map(l => {
      const prod = state.products.find(p => p.id === l.id);
      return { id: prod.id, name: prod.name, price: prod.price, qty: l.qty, unit: prod.unit };
    }),
    subtotal: cartSubtotal(),
    deliveryFee: cartDeliveryFee(),
    discount: cartDiscount(),
    total: cartTotal(),
    deliveryMethod: c.delivery,
    paymentMethod: c.payment,
    status: 'Order Placed',
    userEmail: state.currentUser ? state.currentUser.email : null
  };

  // Deduct stock
  order.products.forEach(item => {
    const prod = state.products.find(p => p.id === item.id);
    if(prod) prod.stock = Math.max(0, prod.stock - item.qty);
  });
  saveProducts(state.products);

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  state.cart = [];
  saveCart(state.cart);
  updateBadges();

  toast('Order placed successfully');
  renderOrderSuccess(order);
}

function renderOrderSuccess(order){
  const app = document.getElementById('app');
  const days = order.deliveryMethod === 'Express Delivery' ? 'Today' : (order.deliveryMethod === 'Store Pickup' ? 'Ready for pickup today' : '2-3 business days');
  app.innerHTML = `
  <section class="section">
    <div class="container" style="max-width:640px;text-align:center;">
      <i class="fa-solid fa-circle-check" style="font-size:60px;color:var(--green-600);"></i>
      <h2 style="margin-top:18px;">Your order has been placed successfully.</h2>
      <div class="summary-card" style="text-align:left;margin-top:24px;">
        <div class="summary-row"><span>Order Number</span><strong>${order.orderNumber}</strong></div>
        <div class="summary-row"><span>Total Amount</span><strong>${formatPrice(order.total)}</strong></div>
        <div class="summary-row"><span>Delivery Address</span><span style="text-align:right;max-width:60%;">${escapeHtml(order.address.house)}, ${escapeHtml(order.address.street)}, ${escapeHtml(order.address.city)}</span></div>
        <div class="summary-row"><span>Estimated Delivery</span><span>${days}</span></div>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap;">
        <button class="btn btn-primary" data-action="go-orders">View My Orders</button>
        <button class="btn btn-outline" data-action="navigate" data-route="shop">Continue Shopping</button>
      </div>
    </div>
  </section>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================ 22. MY ORDERS VIEW ============================ */
function renderMyOrders(){
  if(!state.currentUser){
    return `<section class="section">${emptyStateHTML('fa-lock','Please login','Login to view your order history.', '<button class="btn btn-primary" data-action="open-login">Login</button>')}</section>`;
  }
  const orders = loadOrders().filter(o => o.userEmail === state.currentUser.email).reverse();
  if(orders.length === 0){
    return `<section class="section">${emptyStateHTML('fa-receipt',"You haven't placed any orders yet","Your past orders will show up here.", '<button class="btn btn-primary" data-action="navigate" data-route="shop">Shop Now</button>')}</section>`;
  }
  return `
  <section class="section">
    <div class="container" style="max-width:820px;">
      <div class="section-head"><div><h2>My Orders</h2><p>${orders.length} order${orders.length!==1?'s':''} placed.</p></div></div>
      ${orders.map(orderCardHTML).join('')}
    </div>
  </section>`;
}

function orderCardHTML(order){
  const statusClass = order.status === 'Delivered' ? 'delivered' : (order.status === 'Cancelled' ? 'cancelled' : 'placed');
  return `
  <div class="order-card">
    <div class="order-card-top">
      <div><strong>${order.orderNumber}</strong><br><span style="font-size:12.5px;color:var(--ink-500);">${new Date(order.date).toLocaleDateString()}</span></div>
      <span class="order-status ${statusClass}">${order.status}</span>
    </div>
    <p style="margin:6px 0;">${order.products.length} item${order.products.length!==1?'s':''} &middot; ${formatPrice(order.total)}</p>
    <button class="btn btn-outline btn-sm" data-action="view-order" data-order="${order.orderNumber}">View Details</button>
  </div>`;
}

function openOrderDetailModal(orderNumber){
  const order = loadOrders().find(o => o.orderNumber === orderNumber);
  if(!order) return;
  const lines = order.products.map(p => `<div class="review-line"><span>${escapeHtml(p.name)} × ${p.qty}</span><span>${formatPrice(p.price * p.qty)}</span></div>`).join('');
  openModal(`
    <div class="modal-head"><h3>Order ${order.orderNumber}</h3><button class="modal-close" data-action="close-modal">&times;</button></div>
    <div class="modal-body">
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Placed:</strong> ${new Date(order.date).toLocaleString()}</p>
      <p><strong>Delivery:</strong> ${escapeHtml(order.address.house)}, ${escapeHtml(order.address.street)}, ${escapeHtml(order.address.city)}, ${escapeHtml(order.address.district)}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      <div style="margin-top:12px;">${lines}</div>
      <div class="review-line"><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
      <div class="review-line"><span>Delivery</span><span>${order.deliveryFee===0?'Free':formatPrice(order.deliveryFee)}</span></div>
      <div class="review-line" style="font-weight:800;border-bottom:none;"><span>Total</span><span>${formatPrice(order.total)}</span></div>
    </div>`, { large: true });
}

/* ============================ 23. ADMIN: SHELL & NAV ============================ */
function renderAdminDenied(){
  document.getElementById('app').innerHTML = `
  <section class="section"><div class="container admin-denied">
    <i class="fa-solid fa-user-lock" style="font-size:48px;color:var(--sale-500);"></i>
    <h2 style="margin-top:14px;">Admin access required.</h2>
    <p>Please login with a demo admin account to view the dashboard.</p>
    <button class="btn btn-primary" data-action="open-login">Login</button>
  </div></section>`;
}

const ADMIN_MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fa-gauge' },
  { key: 'products', label: 'Products', icon: 'fa-carrot' },
  { key: 'orders', label: 'Orders', icon: 'fa-receipt' },
  { key: 'customers', label: 'Customers', icon: 'fa-users' },
  { key: 'categories', label: 'Categories', icon: 'fa-layer-group' },
  { key: 'offers', label: 'Offers', icon: 'fa-tags' },
  { key: 'settings', label: 'Settings', icon: 'fa-gear' }
];

function renderAdmin(){
  const sec = state.admin.section;
  return `
  <div class="admin-layout">
    <aside class="admin-sidebar">
      ${ADMIN_MENU.map(m => `<a href="#" class="${sec===m.key?'active':''}" data-action="admin-nav" data-sec="${m.key}"><i class="fa-solid ${m.icon}"></i> ${m.label}</a>`).join('')}
      <a href="#" data-action="logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
    </aside>
    <div class="admin-main" id="adminMain">${renderAdminSection(sec)}</div>
  </div>`;
}

function renderAdminSection(sec){
  switch(sec){
    case 'dashboard': return renderAdminDashboard();
    case 'products': return renderAdminProducts();
    case 'orders': return renderAdminOrders();
    case 'customers': return renderAdminCustomers();
    case 'categories': return renderAdminCategories();
    case 'offers': return renderAdminOffers();
    case 'settings': return renderAdminSettings();
    default: return renderAdminDashboard();
  }
}

function refreshAdminMain(){
  document.getElementById('adminMain').innerHTML = renderAdminSection(state.admin.section);
  bindAdminEvents();
  bindImageFallbacks();
}

/* ============================ 24. ADMIN: DASHBOARD ============================ */
function renderAdminDashboard(){
  const orders = loadOrders();
  const users = loadUsers();
  const today = new Date().toDateString();
  const todaysOrders = orders.filter(o => new Date(o.date).toDateString() === today);
  const totalSales = orders.reduce((s,o) => s + o.total, 0);
  const todaysSales = todaysOrders.reduce((s,o) => s + o.total, 0);
  const pending = orders.filter(o => !['Delivered','Cancelled'].includes(o.status)).length;
  const lowStock = state.products.filter(p => p.stock > 0 && p.stock <= 10).length;

  // simple 7-day sales bar chart (CSS only)
  const days = [...Array(7)].map((_,i) => { const d = new Date(); d.setDate(d.getDate() - (6-i)); return d; });
  const daySales = days.map(d => orders.filter(o => new Date(o.date).toDateString() === d.toDateString()).reduce((s,o) => s + o.total, 0));
  const maxSale = Math.max(1, ...daySales);

  return `
    <div class="admin-toolbar"><h2 style="margin:0;">Dashboard</h2></div>
    <div class="stat-grid">
      <div class="stat-card"><span>Total Products</span><strong>${state.products.length}</strong></div>
      <div class="stat-card"><span>Total Orders</span><strong>${orders.length}</strong></div>
      <div class="stat-card"><span>Total Customers</span><strong>${users.length}</strong></div>
      <div class="stat-card"><span>Total Sales</span><strong>${formatPrice(totalSales)}</strong></div>
      <div class="stat-card"><span>Today's Sales</span><strong>${formatPrice(todaysSales)}</strong></div>
      <div class="stat-card"><span>Today's Orders</span><strong>${todaysOrders.length}</strong></div>
      <div class="stat-card"><span>Pending Orders</span><strong>${pending}</strong></div>
      <div class="stat-card"><span>Low Stock Products</span><strong>${lowStock}</strong></div>
    </div>
    <div class="stat-card" style="padding-bottom:34px;">
      <span>Sales — Last 7 Days</span>
      <div class="bar-chart">
        ${daySales.map((v,i) => `<div class="bar" style="height:${Math.max(4,(v/maxSale)*130)}px;"><span>${days[i].toLocaleDateString(undefined,{weekday:'short'})}</span></div>`).join('')}
      </div>
    </div>`;
}

/* ============================ 25. ADMIN: PRODUCTS ============================ */
function renderAdminProducts(){
  return `
    <div class="admin-toolbar">
      <h2 style="margin:0;">Products</h2>
      <div style="display:flex;gap:10px;">
        <input type="text" id="adminProdSearch" placeholder="Search products..." style="padding:9px 12px;border:1.5px solid var(--line);border-radius:var(--radius-md);">
        <button class="btn btn-primary" id="addProductBtn"><i class="fa-solid fa-plus"></i> Add Product</button>
      </div>
    </div>
    <table class="data-table">
      <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
      <tbody id="adminProductsBody">${state.products.map(adminProductRow).join('')}</tbody>
    </table>`;
}

function adminProductRow(prod){
  return `<tr data-row-id="${prod.id}">
    <td>${escapeHtml(prod.name)}</td>
    <td>${escapeHtml(prod.category)}</td>
    <td>${formatPrice(prod.price)}</td>
    <td>${prod.stock}</td>
    <td>${prod.featured ? '<i class="fa-solid fa-star" style="color:var(--mango-500);"></i>' : '—'}</td>
    <td class="table-actions">
      <button class="btn btn-sm btn-outline" data-action="edit-product" data-id="${prod.id}">Edit</button>
      <button class="btn btn-sm btn-danger" data-action="delete-product" data-id="${prod.id}">Delete</button>
    </td>
  </tr>`;
}

function filterAdminProductsTable(query){
  const q = query.trim().toLowerCase();
  const items = state.products.filter(p => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  document.getElementById('adminProductsBody').innerHTML = items.map(adminProductRow).join('');
}

function openAdminProductForm(productId){
  const editing = !!productId;
  const prod = editing ? state.products.find(p => p.id === productId) : { name:'', category: state.categories[0].name, price:'', oldPrice:'', unit:'', stock:'', image:'', description:'', featured:false };
  openModal(`
    <div class="modal-head"><h3>${editing ? 'Edit Product' : 'Add Product'}</h3><button class="modal-close" data-action="close-modal">&times;</button></div>
    <div class="modal-body">
      <form id="productForm">
        <div class="form-grid">
          <div class="form-group full"><label>Product Name</label><input type="text" id="pfName" value="${escapeHtml(prod.name)}" required></div>
          <div class="form-group"><label>Category</label><select id="pfCategory">${state.categories.map(c => `<option ${prod.category===c.name?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}</select></div>
          <div class="form-group"><label>Unit</label><input type="text" id="pfUnit" value="${escapeHtml(prod.unit)}" placeholder="e.g. 1 kg" required></div>
          <div class="form-group"><label>Price (Rs.)</label><input type="number" id="pfPrice" value="${prod.price}" required></div>
          <div class="form-group"><label>Old Price (Rs.)</label><input type="number" id="pfOldPrice" value="${prod.oldPrice||''}"></div>
          <div class="form-group"><label>Stock</label><input type="number" id="pfStock" value="${prod.stock}" required></div>
          <div class="form-group"><label>Image URL</label><input type="text" id="pfImage" value="${escapeHtml(prod.image||'')}" placeholder="Leave blank for auto image"></div>
          <div class="form-group full"><label>Description</label><textarea id="pfDescription" rows="3">${escapeHtml(prod.description||'')}</textarea></div>
          <div class="form-group"><label><input type="checkbox" id="pfFeatured" ${prod.featured?'checked':''}> Featured Product</label></div>
        </div>
        <span class="field-error" id="productFormError"></span>
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:10px;">
          <button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">${editing ? 'Update Product' : 'Save Product'}</button>
        </div>
      </form>
    </div>`, { large: true });

  document.getElementById('productForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('pfName').value.trim();
    const category = document.getElementById('pfCategory').value;
    const unit = document.getElementById('pfUnit').value.trim();
    const price = Number(document.getElementById('pfPrice').value);
    const oldPriceRaw = document.getElementById('pfOldPrice').value;
    const oldPrice = oldPriceRaw ? Number(oldPriceRaw) : null;
    const stock = Number(document.getElementById('pfStock').value);
    const image = document.getElementById('pfImage').value.trim();
    const description = document.getElementById('pfDescription').value.trim();
    const featured = document.getElementById('pfFeatured').checked;
    const errEl = document.getElementById('productFormError');

    if(!name || !unit || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0){
      errEl.textContent = 'Please fill in all required fields with valid values.';
      return;
    }
    if(oldPrice !== null && oldPrice <= price){
      errEl.textContent = 'Old price must be greater than the current price.';
      return;
    }

    const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    if(editing){
      Object.assign(prod, { name, category, unit, price, oldPrice, stock, description, featured, discount, image: image || prod.image });
      toast('Product updated');
    } else {
      const newId = Math.max(0, ...state.products.map(p => p.id)) + 1;
      state.products.push({ id: newId, name, category, unit, price, oldPrice, stock, description, featured, discount, rating: 4.0, image: image || imageFor(newId, category) });
      toast('Product added');
    }
    saveProducts(state.products);
    closeModal();
    refreshAdminMain();
  });
}

function deleteProduct(productId){
  state.products = state.products.filter(p => p.id !== productId);
  saveProducts(state.products);
  state.cart = state.cart.filter(l => l.id !== productId);
  saveCart(state.cart);
  state.wishlist = state.wishlist.filter(id => id !== productId);
  saveWishlist(state.wishlist);
  updateBadges();
  toast('Product deleted');
  refreshAdminMain();
}

/* ============================ 26. ADMIN: ORDERS ============================ */
const ORDER_STATUSES = ['Order Placed','Processing','Packed','Out for Delivery','Delivered','Cancelled'];

function renderAdminOrders(){
  const orders = loadOrders().slice().reverse();
  if(orders.length === 0) return emptyStateHTML('fa-receipt','No orders yet','Orders placed by customers will appear here.');
  return `
    <div class="admin-toolbar"><h2 style="margin:0;">Orders</h2></div>
    <table class="data-table">
      <thead><tr><th>Order #</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        ${orders.map(o => `
        <tr>
          <td>${o.orderNumber}</td>
          <td>${escapeHtml(o.customer.fullName)}</td>
          <td>${new Date(o.date).toLocaleDateString()}</td>
          <td>${o.products.length}</td>
          <td>${formatPrice(o.total)}</td>
          <td>${escapeHtml(o.paymentMethod)}</td>
          <td>
            <select class="status-select" data-action="update-order-status" data-order="${o.orderNumber}">
              ${ORDER_STATUSES.map(s => `<option ${o.status===s?'selected':''}>${s}</option>`).join('')}
            </select>
          </td>
          <td><button class="btn btn-sm btn-outline" data-action="view-order" data-order="${o.orderNumber}">View</button></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function updateOrderStatus(orderNumber, newStatus){
  const orders = loadOrders();
  const order = orders.find(o => o.orderNumber === orderNumber);
  if(!order) return;
  order.status = newStatus;
  saveOrders(orders);
  toast('Order status updated');
}

/* ============================ 27. ADMIN: CUSTOMERS ============================ */
function renderAdminCustomers(){
  const users = loadUsers();
  const orders = loadOrders();
  if(users.length === 0) return emptyStateHTML('fa-users','No customers yet','Registered customers will appear here.');
  return `
    <div class="admin-toolbar"><h2 style="margin:0;">Customers</h2></div>
    <table class="data-table">
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Registered</th><th>Orders</th><th>Total Spent</th></tr></thead>
      <tbody>
        ${users.map(u => {
          const userOrders = orders.filter(o => o.userEmail === u.email);
          const spent = userOrders.reduce((s,o) => s + o.total, 0);
          return `<tr><td>${escapeHtml(u.fullName)}</td><td>${escapeHtml(u.email)}</td><td>${escapeHtml(u.phone||'—')}</td><td>${new Date(u.registeredAt).toLocaleDateString()}</td><td>${userOrders.length}</td><td>${formatPrice(spent)}</td></tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

/* ============================ 28. ADMIN: CATEGORIES ============================ */
function renderAdminCategories(){
  return `
    <div class="admin-toolbar">
      <h2 style="margin:0;">Categories</h2>
      <button class="btn btn-primary" id="addCategoryBtn"><i class="fa-solid fa-plus"></i> Add Category</button>
    </div>
    <table class="data-table">
      <thead><tr><th>Icon</th><th>Name</th><th>Description</th><th>Products</th><th>Actions</th></tr></thead>
      <tbody>
        ${state.categories.map(c => `
        <tr>
          <td><i class="fa-solid ${c.icon}"></i></td>
          <td>${escapeHtml(c.name)}</td>
          <td>${escapeHtml(c.description||'')}</td>
          <td>${state.products.filter(p => p.category === c.name).length}</td>
          <td class="table-actions">
            <button class="btn btn-sm btn-outline" data-action="edit-category" data-id="${c.id}">Edit</button>
            <button class="btn btn-sm btn-danger" data-action="delete-category" data-id="${c.id}">Delete</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function openAdminCategoryForm(catId){
  const editing = !!catId;
  const cat = editing ? state.categories.find(c => c.id === catId) : { name:'', icon:'fa-basket-shopping', description:'' };
  openModal(`
    <div class="modal-head"><h3>${editing ? 'Edit Category' : 'Add Category'}</h3><button class="modal-close" data-action="close-modal">&times;</button></div>
    <div class="modal-body">
      <form id="categoryForm">
        <div class="form-group"><label>Category Name</label><input type="text" id="cfName" value="${escapeHtml(cat.name)}" required></div>
        <div class="form-group"><label>Icon (Font Awesome class, e.g. fa-carrot)</label><input type="text" id="cfIcon" value="${escapeHtml(cat.icon)}" required></div>
        <div class="form-group"><label>Description</label><textarea id="cfDescription" rows="3">${escapeHtml(cat.description||'')}</textarea></div>
        <span class="field-error" id="categoryFormError"></span>
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:10px;">
          <button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button>
          <button type="submit" class="btn btn-primary">${editing ? 'Update Category' : 'Save Category'}</button>
        </div>
      </form>
    </div>`);
  document.getElementById('categoryForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cfName').value.trim();
    const icon = document.getElementById('cfIcon').value.trim() || 'fa-basket-shopping';
    const description = document.getElementById('cfDescription').value.trim();
    if(!name){ document.getElementById('categoryFormError').textContent = 'Category name is required.'; return; }
    if(editing){
      Object.assign(cat, { name, icon, description });
      toast('Category updated');
    } else {
      const newId = Math.max(0, ...state.categories.map(c => c.id)) + 1;
      state.categories.push({ id: newId, name, icon, description });
      toast('Category added');
    }
    saveCategories(state.categories);
    closeModal();
    refreshAdminMain();
  });
}

function deleteCategory(catId){
  state.categories = state.categories.filter(c => c.id !== catId);
  saveCategories(state.categories);
  toast('Category deleted');
  refreshAdminMain();
}

/* ============================ 29. ADMIN: OFFERS ============================ */
function renderAdminOffers(){
  const offers = state.products.filter(p => p.discount > 0);
  return `
    <div class="admin-toolbar"><h2 style="margin:0;">Offers</h2><p style="margin:0;color:var(--ink-500);">Set an "Old Price" on a product to create an offer.</p></div>
    ${offers.length ? `<table class="data-table">
      <thead><tr><th>Product</th><th>Old Price</th><th>New Price</th><th>Discount</th><th>Action</th></tr></thead>
      <tbody>${offers.map(o => `
        <tr>
          <td>${escapeHtml(o.name)}</td><td>${formatPrice(o.oldPrice)}</td><td>${formatPrice(o.price)}</td><td>${o.discount}%</td>
          <td><button class="btn btn-sm btn-outline" data-action="edit-product" data-id="${o.id}">Edit</button></td>
        </tr>`).join('')}</tbody>
    </table>` : emptyStateHTML('fa-tags','No active offers','Edit a product and add an old price to create an offer.')}`;
}

/* ============================ 30. ADMIN: SETTINGS ============================ */
function renderAdminSettings(){
  const s = state.settings;
  return `
    <div class="admin-toolbar"><h2 style="margin:0;">Settings</h2></div>
    <form id="settingsForm" style="max-width:420px;">
      <div class="form-group"><label>Delivery Fee (Rs.)</label><input type="number" id="sfFee" value="${s.deliveryFee}"></div>
      <div class="form-group"><label>Free Delivery Over (Rs.)</label><input type="number" id="sfFreeOver" value="${s.freeDeliveryOver}"></div>
      <button type="submit" class="btn btn-primary">Save Settings</button>
    </form>`;
}

function bindSettingsForm(){
  const form = document.getElementById('settingsForm');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    state.settings.deliveryFee = Number(document.getElementById('sfFee').value) || 0;
    state.settings.freeDeliveryOver = Number(document.getElementById('sfFreeOver').value) || 0;
    saveSettings(state.settings);
    toast('Settings saved');
  });
}

/* ============================ 31. ADMIN EVENT BINDING ============================ */
function bindAdminEvents(){
  document.querySelectorAll('[data-action="admin-nav"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); state.admin.section = a.dataset.sec; render(); });
  });
  const addProdBtn = document.getElementById('addProductBtn');
  if(addProdBtn) addProdBtn.addEventListener('click', () => openAdminProductForm(null));
  const addCatBtn = document.getElementById('addCategoryBtn');
  if(addCatBtn) addCatBtn.addEventListener('click', () => openAdminCategoryForm(null));
  const prodSearch = document.getElementById('adminProdSearch');
  if(prodSearch) prodSearch.addEventListener('input', () => filterAdminProductsTable(prodSearch.value));
  bindSettingsForm();
  document.querySelectorAll('[data-action="update-order-status"]').forEach(sel => {
    sel.addEventListener('change', () => updateOrderStatus(sel.dataset.order, sel.value));
  });
}

/* ============================ 32. GLOBAL EVENT DELEGATION ============================ */
document.addEventListener('click', e => {
  const target = e.target.closest('[data-action], [data-route]');
  if(!target) return;
  const action = target.dataset.action;
  const route = target.dataset.route;

  // plain navigation links (header/footer/logo)
  if(route && !action){
    e.preventDefault();
    navigate(route);
    return;
  }

  switch(action){
    case 'navigate':
      e.preventDefault();
      navigate(target.dataset.route);
      break;
    case 'open-login':
      openAuthModal('login');
      break;
    case 'logout':
      e.preventDefault();
      logoutUser();
      break;
    case 'close-modal':
      closeModal();
      break;
    case 'go-checkout':
      goCheckout();
      break;
    case 'go-orders':
      navigate('orders');
      break;
    case 'go-admin':
      navigate('admin');
      break;
    case 'toggle-wishlist':
      toggleWishlist(Number(target.dataset.id));
      break;
    case 'open-product':
      openProductModal(Number(target.dataset.id));
      break;
    case 'add-to-cart': {
      const id = Number(target.dataset.id);
      addToCart(id, getPendingQty(id));
      pendingQty[id] = 1;
      const disp = document.querySelector(`[data-qty-display="${id}"]`);
      if(disp) disp.textContent = 1;
      break;
    }
    case 'qty-inc': {
      const id = Number(target.dataset.id);
      const prod = state.products.find(p => p.id === id);
      pendingQty[id] = Math.min(prod ? prod.stock || 1 : 99, getPendingQty(id) + 1);
      const disp = document.querySelector(`[data-qty-display="${id}"]`);
      if(disp) disp.textContent = pendingQty[id];
      break;
    }
    case 'qty-dec': {
      const id = Number(target.dataset.id);
      pendingQty[id] = Math.max(1, getPendingQty(id) - 1);
      const disp = document.querySelector(`[data-qty-display="${id}"]`);
      if(disp) disp.textContent = pendingQty[id];
      break;
    }
    case 'remove-cart':
      e.preventDefault();
      openConfirm('Remove this item from your cart?', () => removeFromCart(Number(target.dataset.id)));
      break;
    case 'cart-qty-inc': {
      const id = Number(target.dataset.id);
      const line = state.cart.find(l => l.id === id);
      updateCartQuantity(id, (line ? line.qty : 0) + 1);
      break;
    }
    case 'cart-qty-dec': {
      const id = Number(target.dataset.id);
      const line = state.cart.find(l => l.id === id);
      updateCartQuantity(id, (line ? line.qty : 0) - 1);
      break;
    }
    case 'filter-category':
      state.shop.category = target.dataset.cat;
      navigate('shop');
      break;
    case 'toggle-filters':
      document.getElementById('filterPanel').classList.toggle('open');
      document.getElementById('overlay').classList.toggle('visible');
      break;
    case 'reset-filters':
      resetShopFilters();
      break;
    case 'view-order':
      openOrderDetailModal(target.dataset.order);
      break;
    case 'edit-product':
      openAdminProductForm(Number(target.dataset.id));
      break;
    case 'delete-product':
      openConfirm('Delete this product? This cannot be undone.', () => deleteProduct(Number(target.dataset.id)));
      break;
    case 'edit-category':
      openAdminCategoryForm(Number(target.dataset.id));
      break;
    case 'delete-category':
      openConfirm('Delete this category? This cannot be undone.', () => deleteCategory(Number(target.dataset.id)));
      break;
    default:
      break;
  }
});

// Close overlay / mobile panels when clicking the overlay background
document.getElementById('overlay').addEventListener('click', () => {
  closeModal();
  closeMobileMenus();
  const fp = document.getElementById('filterPanel');
  if(fp) fp.classList.remove('open');
});

/* ============================ 33. HEADER BEHAVIOUR ============================ */
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('visible');
});
document.getElementById('mobileSearchBtn').addEventListener('click', () => {
  const box = document.getElementById('searchInput');
  document.querySelector('.header-search').style.display = 'flex';
  box.focus();
});

let searchDebounce;
document.getElementById('searchInput').addEventListener('input', e => {
  clearTimeout(searchDebounce);
  const q = e.target.value;
  searchDebounce = setTimeout(() => {
    state.shop.query = q;
    if(state.route !== 'shop'){ navigate('shop'); } else { refreshShopList(); }
  }, 200);
});

/* ============================ 34. KEYBOARD ACCESSIBILITY ============================ */
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    if(document.getElementById('modalRoot').innerHTML.trim() !== ''){ closeModal(); }
    else { closeMobileMenus(); }
  }
});

/* ============================ 35. INIT ============================ */
function init(){
  updateBadges();
  updateAccountArea();
  navigate('home');
}
init();
