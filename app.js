/* =========================
   دیجی‌شاپ — فقط فرانت‌اند
   ویژگی‌ها: جستجو، فیلتر، مرتب‌سازی، سبد خرید با localStorage،
   تم روشن/تاریک با ذخیره‌سازی، کد تخفیف DIGI10، ریسپانسیو
   ========================= */

const TAX_RATE = 0.09; // ۹٪
const DISCOUNT_CODES = { DIGI10: 0.10 }; // ۱۰٪

/* ------ ابزارک‌ها ------ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const formatPrice = (num) =>
  `${new Intl.NumberFormat('fa-IR').format(num)} تومان`;

/* ------ داده‌های نمونه محصولات ------ */
const products = [
  {
    id: 'p1',
    title: 'گوشی هوشمند آلفا X12',
    category: 'موبایل',
    price: 18990000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop',
    desc: 'نمایشگر AMOLED، دوربین ۵۰ مگاپیکسل، 5G، شارژ سریع ۶۷ وات.'
  },
  {
    id: 'p2',
    title: 'لپ‌تاپ نوا بوک ۱۵',
    category: 'لپ‌تاپ',
    price: 42990000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    desc: 'Core i7 نسل 12، رم 16GB، SSD 512GB، نمایشگر ۱۵.۶ اینچ.'
  },
  {
    id: 'p3',
    title: 'هدفون بی‌سیم سایلنس پرو',
    category: 'هدفون',
    price: 4990000,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1518447953931-4f1b9627fd2e?q=80&w=1200&auto=format&fit=crop',
    desc: 'حذف نویز فعال، ۴۰ ساعت شارژدهی، بلوتوث 5.2.'
  },
  {
    id: 'p4',
    title: 'ساعت هوشمند لایফ‌فیت ۲',
    category: 'ساعت هوشمند',
    price: 3890000,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1518441902114-9e9b8499a8d3?q=80&w=1200&auto=format&fit=crop',
    desc: 'پایش ضربان، GPS، ضدآب 5ATM، پایش خواب و استرس.'
  },
  {
    id: 'p5',
    title: 'کنسول بازی آرو گیم',
    category: 'کنسول',
    price: 24990000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1606813907291-76a360fcd21d?q=80&w=1200&auto=format&fit=crop',
    desc: 'گرافیک نسل جدید، SSD فوق سریع، کنترلر لمسی ارتقا یافته.'
  },
  {
    id: 'p6',
    title: 'گوشی هوشمند نئوکام S',
    category: 'موبایل',
    price: 13990000,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop',
    desc: 'دوربین دوگانه ۴۸ مگاپیکسل، نمایشگر ۹۰ هرتز، باتری ۵۰۰۰.'
  },
  {
    id: 'p7',
    title: 'لپ‌تاپ کریستال ایر ۱۳',
    category: 'لپ‌تاپ',
    price: 53990000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1200&auto=format&fit=crop',
    desc: 'سبک و باریک، M2/RTX4060 (نمونه)، نمایشگر باکیفیت ۱۳".'
  },
  {
    id: 'p8',
    title: 'ایربادز اسپورت مینی',
    category: 'هدفون',
    price: 1890000,
    rating: 3.9,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop',
    desc: 'کیس شارژ جیبی، ضد تعریق، بیس متعادل.'
  },
  {
    id: 'p9',
    title: 'ساعت هوشمند اولترا Max',
    category: 'ساعت هوشمند',
    price: 8290000,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=1200&auto=format&fit=crop',
    desc: 'نمایشگر بزرگ، باتری پرقدرت، بند سیلیکونی راحت.'
  },
  {
    id: 'p10',
    title: 'کنسول دستی پالس',
    category: 'کنسول',
    price: 11990000,
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop',
    desc: 'بازی‌های مستقل، نمایشگر ۷ اینچ، وای‌فای دو بانده.'
  }
];

/* ------ وضعیت برنامه ------ */
const state = {
  theme: 'dark',
  search: '',
  category: 'all',
  priceMin: 0,
  priceMax: 0, // 0 یعنی نامحدود
  sort: 'default',
  cart: {}, // {productId: {id, title, price, image, qty}}
  coupon: null,
};

/* ------ کلیدهای localStorage ------ */
const LS_KEYS = {
  THEME: 'digishop_theme',
  CART: 'digishop_cart',
  COUPON: 'digishop_coupon'
};

/* ------ انتخابگرهای DOM ------ */
const productsGrid = $('#productsGrid');
const categoryFilter = $('#categoryFilter');
const priceMinInput = $('#priceMin');
const priceMaxInput = $('#priceMax');
const searchInput = $('#searchInput');
const sortSelect = $('#sortSelect');
const cartBtn = $('#cartBtn');
const cartDrawer = $('#cartDrawer');
const closeCart = $('#closeCart');
const overlay = $('#overlay');
const cartItemsEl = $('#cartItems');
const subtotalEl = $('#subtotal');
const taxEl = $('#tax');
const totalEl = $('#total');
const discountEl = $('#discount');
const discountRow = $('#discountRow');
const cartCountEl = $('#cartCount');
const couponInput = $('#couponInput');
const applyCouponBtn = $('#applyCoupon');
const themeToggle = $('#themeToggle');
const productModal = $('#productModal');
const modalContent = $('#modalContent');

/* ------ مقداردهی اولیه ------ */
function init() {
  // تم
  const savedTheme = localStorage.getItem(LS_KEYS.THEME);
  if (savedTheme) state.theme = savedTheme;
  setTheme(state.theme);

  // سبد
  const savedCart = localStorage.getItem(LS_KEYS.CART);
  if (savedCart) state.cart = JSON.parse(savedCart);

  const savedCoupon = localStorage.getItem(LS_KEYS.COUPON);
  if (savedCoupon) state.coupon = savedCoupon;

  // دسته‌بندی‌ها
  const cats = ['همه', ...new Set(products.map(p => p.category))];
  categoryFilter.innerHTML = cats
    .map((c, i) => `<option value="${i===0?'all':c}">${c}</option>`)
    .join('');

  // حداقل/حداکثر قیمت
  const prices = products.map(p => p.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  priceMinInput.value = 0;
  priceMaxInput.value = maxP;

  // رندر اولیه
  render();
  updateCartUI();
  updateCartCount();
}
document.addEventListener('DOMContentLoaded', init);

/* ------ تم ------ */
function setTheme(mode) {
  state.theme = mode;
  document.documentElement.classList.toggle('light', mode === 'light');
  localStorage.setItem(LS_KEYS.THEME, mode);
}
themeToggle.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
});

/* ------ فیلتر/جستجو/مرتب‌سازی ------ */
searchInput.addEventListener('input', (e) => { state.search = e.target.value.trim(); render(); });
categoryFilter.addEventListener('change', (e) => { state.category = e.target.value; render(); });
priceMinInput.addEventListener('input', (e) => { state.priceMin = +e.target.value || 0; render(); });
priceMaxInput.addEventListener('input', (e) => { state.priceMax = +e.target.value || 0; render(); });
sortSelect.addEventListener('change', (e) => { state.sort = e.target.value; render(); });

function getFilteredSortedProducts() {
  let list = products.slice();

  // جستجو
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
  }

  // دسته‌بندی
  if (state.category !== 'all') {
    list = list.filter(p => p.category === state.category);
  }

  // قیمت
  list = list.filter(p => {
    const minOk = state.priceMin ? p.price >= state.priceMin : true;
    const maxOk = state.priceMax ? p.price <= state.priceMax : true;
    return minOk && maxOk;
  });

  // مرتب‌سازی
  switch (state.sort) {
    case 'price-asc':  list.sort((a,b)=> a.price - b.price); break;
    case 'price-desc': list.sort((a,b)=> b.price - a.price); break;
    case 'rating-desc': list.sort((a,b)=> b.rating - a.rating); break;
    default: /* بدون تغییر */ break;
  }
  return list;
}

/* ------ رندر محصولات ------ */
function render() {
  productsGrid.setAttribute('aria-busy', 'true');
  const items = getFilteredSortedProducts();
  productsGrid.innerHTML = items.map(cardTemplate).join('') || emptyState();
  // اکشن‌ها
  $$('.btn-add').forEach(btn => btn.addEventListener('click', onAddToCart));
  $$('.btn-details').forEach(btn => btn.addEventListener('click', openDetails));
  productsGrid.setAttribute('aria-busy', 'false');
}

function cardTemplate(p) {
  const starFull = '★', starEmpty = '☆';
  const stars = starFull.repeat(Math.round(p.rating)) + starEmpty.repeat(5 - Math.round(p.rating));
  return `
  <article class="card" tabindex="0">
    <img src="${p.image}" alt="${p.title}" loading="lazy" />
    <div class="card-body">
      <h3 class="card-title">${p.title}</h3>
      <div class="stars" aria-label="امتیاز ${p.rating} از ۵">${stars}</div>
      <div class="price">${formatPrice(p.price)}</div>
      <p class="muted">${p.category}</p>
    </div>
    <div class="actions">
      <button class="btn btn-details" data-id="${p.id}">جزئیات</button>
      <button class="btn primary btn-add" data-id="${p.id}">افزودن به سبد</button>
    </div>
  </article>`;
}

function emptyState() {
  return `<div class="muted" style="grid-column: 1/-1; text-align:center; padding:2rem;">
    موردی یافت نشد. فیلترها را تغییر دهید.
  </div>`;
}

/* ------ جزئیات محصول ------ */
function openDetails(e) {
  const id = e.currentTarget.dataset.id;
  const p = products.find(x => x.id === id);
  if (!p) return;
  modalContent.innerHTML = `
    <div style="display:grid; grid-template-columns: 160px 1fr; gap:1rem; align-items:center;">
      <img src="${p.image}" alt="${p.title}" style="width:160px;height:160px;object-fit:cover;border-radius:12px;" />
      <div>
        <h3 style="margin-top:0">${p.title}</h3>
        <p class="muted">${p.category} • امتیاز ${p.rating}/5</p>
        <p style="margin:.5rem 0 1rem">${p.desc}</p>
        <strong>${formatPrice(p.price)}</strong>
      </div>
    </div>
    <div style="display:flex; gap:.5rem; margin-top:1rem; justify-content:flex-end;">
      <button class="btn" onclick="document.getElementById('productModal').close()">بستن</button>
      <button class="btn primary" data-id="${p.id}" onclick="addToCart('${p.id}')">افزودن به سبد</button>
    </div>
  `;
  productModal.showModal();
}

/* ------ سبد خرید ------ */
function openCart() {
  cartDrawer.classList.add('open');
  overlay.hidden = false;
  cartDrawer.setAttribute('aria-hidden', 'false');
}
function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  overlay.hidden = true;
  cartDrawer.setAttribute('aria-hidden', 'true');
}

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', closeCartDrawer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    productModal?.open && productModal.close();
    if (cartDrawer.classList.contains('open')) closeCartDrawer();
  }
});

function onAddToCart(e) {
  const id = e.currentTarget.dataset.id;
  addToCart(id);
}
window.addToCart = addToCart; // برای استفاده در مودال

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (!state.cart[id]) {
    state.cart[id] = { id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 };
  } else {
    state.cart[id].qty += 1;
  }
  persistCart();
  updateCartUI();
  updateCartCount();
}

function removeFromCart(id) {
  delete state.cart[id];
  persistCart();
  updateCartUI();
  updateCartCount();
}

function changeQty(id, delta) {
  if (!state.cart[id]) return;
  state.cart[id].qty += delta;
  if (state.cart[id].qty <= 0) delete state.cart[id];
  persistCart();
  updateCartUI();
  updateCartCount();
}

function persistCart() {
  localStorage.setItem(LS_KEYS.CART, JSON.stringify(state.cart));
}

function updateCartCount() {
  const count = Object.values(state.cart).reduce((s, item) => s + item.qty, 0);
  cartCountEl.textContent = count;
}

/* رندر UI سبد */
function updateCartUI() {
  const items = Object.values(state.cart);
  if (!items.length) {
    cartItemsEl.innerHTML = `<p class="muted" style="text-align:center;">سبد خرید خالی است.</p>`;
  } else {
    cartItemsEl.innerHTML = items.map(cartItemTemplate).join('');
  }

  // رویداد دکمه‌های هر آیتم
  $$('.btn-inc', cartItemsEl).forEach(b => b.addEventListener('click', () => changeQty(b.dataset.id, +1)));
  $$('.btn-dec', cartItemsEl).forEach(b => b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
  $$('.btn-del', cartItemsEl).forEach(b => b.addEventListener('click', () => removeFromCart(b.dataset.id)));

  // محاسبه‌ها
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  let discount = 0;
  if (state.coupon && DISCOUNT_CODES[state.coupon]) {
    discount = Math.round((subtotal + tax) * DISCOUNT_CODES[state.coupon]);
  }
  const total = subtotal + tax - discount;

  subtotalEl.textContent = formatPrice(subtotal);
  taxEl.textContent = formatPrice(tax);
  totalEl.textContent = formatPrice(Math.max(total, 0));
  discountEl.textContent = discount ? `− ${formatPrice(discount)}` : '۰';
  discountRow.classList.toggle('hidden', discount === 0);

  couponInput.value = state.coupon ?? '';
}
function cartItemTemplate(it) {
  return `
    <div class="cart-item">
      <img src="${it.image}" alt="${it.title}" />
      <div>
        <strong>${it.title}</strong>
        <div class="muted">${formatPrice(it.price)}</div>
      </div>
      <div class="qty">
        <button class="btn-dec" data-id="${it.id}" aria-label="کاهش">−</button>
        <span aria-live="polite">${it.qty}</span>
        <button class="btn-inc" data-id="${it.id}" aria-label="افزایش">+</button>
        <button class="btn btn-del" data-id="${it.id}" title="حذف">حذف</button>
      </div>
    </div>
  `;
}

/* کوپن */
applyCouponBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const code = couponInput.value.trim().toUpperCase();
  if (code && DISCOUNT_CODES[code]) {
    state.coupon = code;
    localStorage.setItem(LS_KEYS.COUPON, code);
    updateCartUI();
    alert('کد تخفیف اعمال شد ✅');
  } else {
    state.coupon = null;
    localStorage.removeItem(LS_KEYS.COUPON);
    updateCartUI();
    alert('کد تخفیف معتبر نیست ❌');
  }
});
