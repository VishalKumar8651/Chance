/* =============================================
   script.js — Chance Website v2
   Full Functional: Modal, Cart, Search, Filters
============================================= */

// -----------------------------------------------
// 1. PAGE LOADER
// -----------------------------------------------
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

// -----------------------------------------------
// 2. CUSTOM CURSOR
// -----------------------------------------------
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if (cursorFollower) {
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .product-card, .about-card, .testimonial-card, .contact-item, .cat-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor?.classList.add('cursor-hover');
    cursorFollower?.classList.add('cursor-hover');
    if (el.classList.contains('product-card')) {
      cursorFollower.innerHTML = '<span class="cursor-text">View</span>';
    }
  });
  el.addEventListener('mouseleave', () => {
    cursor?.classList.remove('cursor-hover');
    cursorFollower?.classList.remove('cursor-hover');
    cursorFollower.innerHTML = '';
  });
});

// Magnetic Buttons
document.querySelectorAll('.btn-primary, .btn-ghost, .btn-icon, .social-link').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    btn.style.transition = 'transform 0.1s ease-out';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });
});

// -----------------------------------------------
// 3. HEADER SCROLL
// -----------------------------------------------
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (header) {
    header.classList.toggle('scrolled', scrollY > 50);
    if (scrollY > lastScroll && scrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
  }
  lastScroll = scrollY;
  updateActiveNav();
});

// -----------------------------------------------
// 4. ACTIVE NAV
// -----------------------------------------------
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// -----------------------------------------------
// 5. MOBILE MENU
// -----------------------------------------------
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
});
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
  });
});

// -----------------------------------------------
// 6. SMOOTH SCROLL
// -----------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 90, behavior: 'smooth' });
    }
  });
});

// -----------------------------------------------
// 7. PARTICLES CANVAS
// -----------------------------------------------
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const colors = ['rgba(147,51,234,', 'rgba(236,72,153,', 'rgba(14,165,233,', 'rgba(245,158,11,'];
  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.5 + 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.005,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const a = Math.max(0, Math.min(1, p.alpha + Math.sin(p.pulse) * 0.15));
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')'; ctx.fill();
      particles.forEach(p2 => {
        const dx = p.x - p2.x, dy = p.y - p2.y, dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110 && dist > 0) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color + (0.07 * (1 - dist/110)) + ')';
          ctx.lineWidth = 0.4; ctx.stroke();
        }
      });
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W+10; if (p.x > W+10) p.x = -10;
      if (p.y < -10) p.y = H+10; if (p.y > H+10) p.y = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
  window.addEventListener('mousemove', (e) => {
    particles.forEach(p => {
      const dx = e.clientX - p.x, dy = e.clientY - p.y, d = Math.sqrt(dx*dx+dy*dy);
      if (d < 100) {
        p.vx -= dx/d * 0.3; p.vy -= dy/d * 0.3;
        p.vx = Math.max(-1.5, Math.min(1.5, p.vx));
        p.vy = Math.max(-1.5, Math.min(1.5, p.vy));
      }
    });
  });
})();

// -----------------------------------------------
// 8. SCROLL REVEAL
// -----------------------------------------------
const revealSelectors = '.about-card, .product-card, .testimonial-card, .story-content, .story-visual, .contact-item, .contact-form, .footer-col, .footer-brand, .section-header';
const revealEls = document.querySelectorAll(revealSelectors);
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
  revealObs.observe(el);
});

// -----------------------------------------------
// 9. COUNTER ANIMATION
// -----------------------------------------------
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      let current = 0;
      const step = target / (1800 / 16);
      const t = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(t); }
        entry.target.textContent = Math.floor(current);
      }, 16);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

// -----------------------------------------------
// 10. 3D CARD TILT
// -----------------------------------------------
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
    card.style.transition = 'none';
    card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = '';
  });
});

// -----------------------------------------------
// 11. HERO CARD 3D MOUSE TILT
// -----------------------------------------------
const heroCard = document.getElementById('hero-card');
const heroSection = document.getElementById('home');
if (heroSection && heroCard) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    heroCard.style.transform = `perspective(1200px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    heroCard.style.transition = 'transform 0.8s ease';
    heroCard.style.transform = '';
    setTimeout(() => heroCard.style.transition = '', 800);
  });
}

// Parallax on scroll
const heroImageWrap = document.getElementById('hero-image-wrap');
window.addEventListener('scroll', () => {
  if (heroImageWrap) heroImageWrap.style.transform = `translateY(${window.scrollY * 0.2}px)`;
});

// -----------------------------------------------
// 12. TOAST NOTIFICATION
// -----------------------------------------------
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}
window.showToast = showToast;

// -----------------------------------------------
// 13. CART STATE (Synced to MongoDB for logged-in users)
// -----------------------------------------------
const API_BASE = 'http://localhost:5000';
let cartItems = [];
let cartCount = 0;

// Get current logged-in user from localStorage
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('chance_currentUser'));
  } catch { return null; }
}

function getAuthToken() {
  return localStorage.getItem('chance_authToken');
}

function getAuthHeaders() {
  const token = getAuthToken();
  if (!token) return null;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

// Save cart to MongoDB (for logged-in users)
async function syncCartToServer() {
  const user = getCurrentUser();
  const headers = getAuthHeaders();
  if (!user || !headers) return;
  try {
    await fetch(`${API_BASE}/api/cart`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ items: cartItems })
    });
  } catch (err) {
    console.warn('Could not sync cart to server:', err);
  }
}

// Load cart from MongoDB (for logged-in users)
async function loadCartFromServer() {
  const user = getCurrentUser();
  const headers = getAuthHeaders();
  if (!user || !headers) return;
  try {
    const res = await fetch(`${API_BASE}/api/cart`, { headers });
    if (res.status === 401) {
      localStorage.removeItem('chance_authToken');
      localStorage.removeItem('chance_currentUser');
      return;
    }
    const data = await res.json();
    if (data.success && Array.isArray(data.items)) {
      cartItems = data.items;
      updateCartBadge();
      renderCart();
    }
  } catch (err) {
    console.warn('Could not load cart from server:', err);
  }
}

// Load cart on page load
loadCartFromServer();

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const label = document.getElementById('cart-count-label');
  if (badge) badge.textContent = cartItems.length;
  if (label) label.textContent = `(${cartItems.length})`;
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total-price');
  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <p>Your cart is empty</p>
        <a href="#collection" class="btn-primary" onclick="closeCart()">Start Shopping</a>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  container.innerHTML = cartItems.map((item, i) => `
    <div class="cart-item">
      <img src="assets/girl.jpg" alt="${item.name}" />
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>Size: ${item.size} · Qty: ${item.qty}</span>
      </div>
      <span class="cart-item-price">${item.price}</span>
      <button class="cart-item-remove" onclick="removeFromCart(${i})" aria-label="Remove">✕</button>
    </div>`).join('');

  if (footer) footer.style.display = 'block';
  const total = cartItems.reduce((sum, item) => {
    return sum + parseInt(item.price.replace(/[^\d]/g, '')) * item.qty;
  }, 0);
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

function removeFromCart(i) {
  cartItems.splice(i, 1);
  updateCartBadge();
  renderCart();
  syncCartToServer();
  showToast('✦ Item removed from cart');
}

function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay-bg')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay-bg')?.classList.remove('open');
  document.body.style.overflow = '';
}

function handleCheckout() {
  if (cartItems.length === 0) { showToast('Your cart is empty! Add some pieces first. 🛍️'); return; }
  closeCart();
  showToast('🎉 Order placed! Thank you for shopping with Chance. We\'ll reach out shortly!', 5000);
  cartItems = [];
  updateCartBadge();
  renderCart();
  syncCartToServer();
}
window.handleCheckout = handleCheckout;
window.closeCart = closeCart;

document.getElementById('cart-btn')?.addEventListener('click', openCart);
document.getElementById('cart-close')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay-bg')?.addEventListener('click', closeCart);

// -----------------------------------------------
// 14. PRODUCT MODAL
// -----------------------------------------------
const modal = document.getElementById('product-modal');
let currentProduct = null;
let currentQty = 1;
let currentSize = 'M';

function openModal(data) {
  if (!modal) return;
  currentQty = 1;
  currentSize = 'M';
  currentProduct = data;

  document.getElementById('modal-img').src = 'assets/girl.jpg';
  document.getElementById('modal-category').textContent = data.category;
  document.getElementById('modal-name').textContent = data.name;
  document.getElementById('modal-price').textContent = data.price;
  document.getElementById('modal-price-old').textContent = data.old;
  document.getElementById('modal-discount').textContent = data.discount;
  document.getElementById('modal-desc').textContent = data.desc;
  document.getElementById('qty-display').textContent = 1;

  const badge = document.getElementById('modal-badge');
  if (data.badge) { badge.textContent = data.badge; badge.style.display = 'block'; }
  else badge.style.display = 'none';

  // Reset size selection
  document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  const mEl = document.querySelector('.size-btn:nth-child(3)');
  if (mEl) mEl.classList.add('active');

  // Reset color
  document.querySelectorAll('.color-swatch').forEach((s, i) => s.classList.toggle('active', i === 0));

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal?.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeSearch(); closeCart(); } });

// Qty controls
document.getElementById('qty-minus')?.addEventListener('click', () => {
  if (currentQty > 1) { currentQty--; document.getElementById('qty-display').textContent = currentQty; }
});
document.getElementById('qty-plus')?.addEventListener('click', () => {
  if (currentQty < 10) { currentQty++; document.getElementById('qty-display').textContent = currentQty; }
});

// Size selection inside modal
document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentSize = this.textContent;
  });
});

// Color selection inside modal
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', function() {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    this.classList.add('active');
  });
});

// Add to Cart from Modal
document.getElementById('modal-add-cart')?.addEventListener('click', () => {
  if (!currentProduct) return;
  cartItems.push({
    name: currentProduct.name,
    price: currentProduct.price,
    size: currentSize,
    qty: currentQty
  });
  updateCartBadge();
  renderCart();
  syncCartToServer();
  closeModal();
  showToast(`🛍️ "${currentProduct.name}" added to your cart!`);
  setTimeout(() => openCart(), 400);
});

// Wishlist
document.getElementById('modal-wishlist')?.addEventListener('click', function() {
  const icon = this.querySelector('svg');
  icon.setAttribute('fill', 'currentColor');
  this.style.color = '#ec4899';
  showToast('❤️ Added to wishlist!');
});

// -----------------------------------------------
// 15. WIRE UP "QUICK VIEW" BUTTONS
// -----------------------------------------------
function wireQuickView() {
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card) return;
      openModal({
        name:     card.dataset.name,
        category: card.dataset.categoryLabel,
        price:    card.dataset.price,
        old:      card.dataset.old,
        discount: card.dataset.discount,
        badge:    card.dataset.badge,
        desc:     card.dataset.desc,
      });
    });
  });

  // Clicking main card area also opens modal
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.quick-view-btn')) return;
      openModal({
        name:     card.dataset.name,
        category: card.dataset.categoryLabel,
        price:    card.dataset.price,
        old:      card.dataset.old,
        discount: card.dataset.discount,
        badge:    card.dataset.badge,
        desc:     card.dataset.desc,
      });
    });
  });
}
wireQuickView();

// -----------------------------------------------
// 16. COLLECTION FILTER
// -----------------------------------------------
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.product-card').forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      card.style.opacity = match ? '1' : '0.2';
      card.style.transform = match ? '' : 'scale(0.95)';
      card.style.pointerEvents = match ? 'auto' : 'none';
    });
  });
});

// Filter from footer links
function filterCollection(cat) {
  document.querySelector(`#collection`)?.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
    btn?.click();
  }, 600);
}
window.filterCollection = filterCollection;

// -----------------------------------------------
// 17. VIEW ALL DESIGNS BUTTON
// -----------------------------------------------
const viewAllBtn = document.getElementById('view-all-btn');
let allVisible = false;
if (viewAllBtn) {
  viewAllBtn.addEventListener('click', () => {
    if (!allVisible) {
      // Show all, remove opacity filters
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = '';
        card.style.pointerEvents = 'auto';
      });
      // Reset filter buttons
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-filter="all"]')?.classList.add('active');
      viewAllBtn.textContent = '✦ Showing All Designs';
      allVisible = true;
      showToast('✦ Showing all 8 designs');
    } else {
      viewAllBtn.textContent = 'View All Designs ✦';
      allVisible = false;
    }
  });
}

// -----------------------------------------------
// 18. DISCOVER MORE BUTTON
// -----------------------------------------------
document.getElementById('discover-more-btn')?.addEventListener('click', () => {
  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
});

// -----------------------------------------------
// 19. SEARCH FUNCTIONALITY
// -----------------------------------------------
const searchOverlay = document.getElementById('search-overlay');
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

const allProducts = [
  { name: 'Midnight Bloom Gown',    category: 'Evening',  price: '₹4,999', badge: 'New' },
  { name: 'Golden Hour Ensemble',   category: 'Luxury',   price: '₹8,999', badge: '✦ Star' },
  { name: 'Breezy Summer Set',      category: 'Casual',   price: '₹2,499', badge: 'Sale' },
  { name: 'Rose Petal Couture',     category: 'Evening',  price: '₹6,499', badge: '' },
  { name: 'Ivory Dreams Bridal',    category: 'Bridal',   price: '₹18,999', badge: 'Bridal' },
  { name: 'Velvet Noir Gown',       category: 'Luxury',   price: '₹11,499', badge: 'Luxury' },
  { name: 'Sunday Bloom Dress',     category: 'Casual',   price: '₹1,999', badge: 'Best Seller' },
  { name: 'Blush Ceremony Lehenga', category: 'Bridal',   price: '₹22,999', badge: 'New' },
];

function renderSearchResults(query) {
  if (!searchResults) return;
  const q = query.toLowerCase();
  const matches = q ? allProducts.filter(p =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  ) : [];
  if (matches.length === 0 && q) {
    searchResults.innerHTML = `<p style="color:var(--clr-text-muted);text-align:center;font-size:0.9rem;">No results for "${query}"</p>`;
    return;
  }
  searchResults.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="closeSearch(); document.getElementById('collection').scrollIntoView({behavior:'smooth'})">
      <img src="assets/girl.jpg" alt="${p.name}" />
      <div class="search-result-info">
        <strong>${p.name}</strong>
        <span>${p.category} · ${p.price}${p.badge ? ' · ' + p.badge : ''}</span>
      </div>
    </div>`).join('');
}

function openSearch() {
  searchOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput?.focus(), 100);
}
function closeSearch() {
  searchOverlay?.classList.remove('open');
  document.body.style.overflow = '';
  if (searchInput) searchInput.value = '';
  if (searchResults) searchResults.innerHTML = '';
}
window.closeSearch = closeSearch;

document.getElementById('search-btn')?.addEventListener('click', openSearch);
document.getElementById('search-close')?.addEventListener('click', closeSearch);
searchOverlay?.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
searchInput?.addEventListener('input', (e) => renderSearchResults(e.target.value));

function searchFor(term) {
  if (searchInput) searchInput.value = term;
  renderSearchResults(term);
}
window.searchFor = searchFor;

// -----------------------------------------------
// 20. NEWSLETTER & CONTACT FORMS
// -----------------------------------------------
function handleSubscribe(e) {
  e.preventDefault();
  const input = document.getElementById('email-input');
  if (input?.value) {
    showToast('✦ Welcome to Chance! Check your inbox for a surprise gift 💜');
    input.value = '';
  }
}
window.handleSubscribe = handleSubscribe;

function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Sent!';
    showToast('💌 Message received! We\'ll reply within 24 hours.');
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; e.target.reset(); }, 2200);
  }, 1200);
}
window.handleContact = handleContact;

// -----------------------------------------------
// 21. FOOTER SUPPORT LINKS
// -----------------------------------------------
window.showToast = showToast;

// -----------------------------------------------
// CONSOLE BRAND
// -----------------------------------------------
console.log(
  '%c✦ CHANCE — Elegance Meets Opportunity%c\nAll systems loaded. Buttons functional!',
  'background:linear-gradient(135deg,#9333ea,#ec4899);color:#fff;padding:10px 20px;border-radius:6px;font-weight:700;font-size:14px;',
  'color:#c084fc;font-size:12px;'
);
