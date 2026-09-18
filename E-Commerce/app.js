// Extended Products Array
const products = [
  {
    id: 1,
    title: "RGB Mechanical Keyboard",
    category: "accessories",
    price: 120.00,
    rating: 4.9,
    reviews: 128,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Ultra-Thin Pro Laptop 15\"",
    category: "laptops",
    price: 2000.00,
    rating: 5.0,
    reviews: 84,
    tag: "HOT",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Gaming Desktop PC RTX 4090",
    category: "laptops",
    price: 3200.00,
    rating: 4.8,
    reviews: 56,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Wireless ANC Headphones",
    category: "audio",
    price: 250.00,
    rating: 4.7,
    reviews: 210,
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Precision Ergonomic Mouse",
    category: "accessories",
    price: 85.00,
    rating: 4.6,
    reviews: 95,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Studio Studio Headphones",
    category: "audio",
    price: 340.00,
    rating: 4.9,
    reviews: 142,
    tag: "PRO",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];
let currentUser = null;

// DOM Selectors
const productGrid = document.getElementById('productGrid');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartCountElement = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const searchInput = document.getElementById('searchInput');
const categoryTitle = document.getElementById('categoryTitle');
const categorySubtitle = document.getElementById('categorySubtitle');

// Auth DOM Selectors
const authWrapper = document.getElementById('authWrapper');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const authModalOverlay = document.getElementById('authModalOverlay');
const tabSignInBtn = document.getElementById('tabSignInBtn');
const tabSignUpBtn = document.getElementById('tabSignUpBtn');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');

// Checkout DOM Selectors
const openCheckoutBtn = document.getElementById('openCheckoutBtn');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
const checkoutForm = document.getElementById('checkoutForm');
const cardOption = document.getElementById('cardOption');
const cashOption = document.getElementById('cashOption');
const cardFields = document.getElementById('cardFields');
const cashFields = document.getElementById('cashFields');
const checkoutTotalAmount = document.getElementById('checkoutTotalAmount');

// Category Metadata Mapping
const categoryMeta = {
  'all': { title: 'All Products', subtitle: 'Explore our complete catalog of high-tech gear' },
  'audio': { title: 'Audio Experience', subtitle: 'Immersive sound, noise cancellation & studio monitors' },
  'laptops': { title: 'Laptops & Computers', subtitle: 'High-performance rigs and ultra-portable laptops' },
  'accessories': { title: 'Accessories', subtitle: 'Keyboards, ergonomic mice, and setup essentials' }
};

// Render Products Logic
function renderProducts(items) {
  productGrid.innerHTML = "";

  if (items.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i class="fa-solid fa-ghost" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p style="font-size: 1.1rem; font-weight: 600;">No products match your filter.</p>
      </div>
    `;
    return;
  }

  items.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      ${product.tag ? `<span class="badge-tag">${product.tag}</span>` : ''}
      <button class="wishlist-icon" title="Add to Wishlist">
        <i class="fa-regular fa-heart"></i>
      </button>
      <div>
        <div class="image-container">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-info">
          <h4>${product.title}</h4>
          <div class="rating">
            <i class="fa-solid fa-star"></i>
            <span>${product.rating} (${product.reviews} reviews)</span>
          </div>
          <div class="price-row">
            <span class="price">$${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button class="add-cart-btn" onclick="addToCart(${product.id})">
        <i class="fa-solid fa-cart-shopping"></i> Add to Cart
      </button>
    `;

    productGrid.appendChild(card);
  });
}

// Add Item To Cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    updateCartUI();
    openCart();
  }
}

// Remove Item From Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Calculate Total Price
function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

// Update Cart Drawer UI
function updateCartUI() {
  cartCountElement.textContent = cart.length;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-dim); margin-top: 4rem;">
        <i class="fa-solid fa-basket-shopping" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.4;"></i>
        <p>Your shopping cart is currently empty.</p>
      </div>
    `;
    cartTotalPrice.textContent = "$0.00";
    return;
  }

  cartItemsContainer.innerHTML = "";
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <h5>${item.title}</h5>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Remove">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  const total = getCartTotal();
  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  checkoutTotalAmount.textContent = `$${total.toFixed(2)}`;
}

// Open/Close Cart Drawer
function openCart() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCart() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// AUTH MODAL LOGIC
function openAuthModal() {
  authModalOverlay.classList.add('active');
}

function closeAuthModal() {
  authModalOverlay.classList.remove('active');
}

openAuthBtn.addEventListener('click', openAuthModal);
closeAuthBtn.addEventListener('click', closeAuthModal);

// Auth Tab Switching
tabSignInBtn.addEventListener('click', () => {
  tabSignInBtn.classList.add('active');
  tabSignUpBtn.classList.remove('active');
  signInForm.classList.add('active');
  signUpForm.classList.remove('active');
});

tabSignUpBtn.addEventListener('click', () => {
  tabSignUpBtn.classList.add('active');
  tabSignInBtn.classList.remove('active');
  signUpForm.classList.add('active');
  signInForm.classList.remove('active');
});

// Form Submissions
signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signInEmail').value;
  const username = email.split('@')[0];
  handleLoginSuccess(username);
});

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signUpName').value;
  handleLoginSuccess(name);
});

function handleLoginSuccess(name) {
  currentUser = name;
  authWrapper.innerHTML = `
    <div class="user-badge-header">
      <img src="profile.jpg" alt="${name}" class="avatar" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'">
      <span>${name}</span>
    </div>
  `;
  closeAuthModal();
  alert(`Welcome back, ${name}!`);
}

// CHECKOUT MODAL LOGIC
openCheckoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  closeCart();
  checkoutModalOverlay.classList.add('active');
});

closeCheckoutBtn.addEventListener('click', () => {
  checkoutModalOverlay.classList.remove('active');
});

// Payment Method Selection
cardOption.addEventListener('click', () => {
  cardOption.classList.add('active');
  cashOption.classList.remove('active');
  cardFields.classList.add('active');
  cashFields.classList.remove('active');

  // Toggle required attribute
  document.querySelectorAll('.card-input').forEach(input => input.required = true);
});

cashOption.addEventListener('click', () => {
  cashOption.classList.add('active');
  cardOption.classList.remove('active');
  cashFields.classList.add('active');
  cardFields.classList.remove('active');

  // Toggle required attribute
  document.querySelectorAll('.card-input').forEach(input => input.required = false);
});

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  
  if (selectedMethod === 'card') {
    alert(`Payment of $${getCartTotal().toFixed(2)} completed successfully via Card!`);
  } else {
    alert(`Order placed successfully! Please pay $${getCartTotal().toFixed(2)} Cash on Delivery.`);
  }

  // Clear Cart
  cart = [];
  updateCartUI();
  checkoutModalOverlay.classList.remove('active');
});

// Category Selection Handler
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selectedCategory = btn.getAttribute('data-category');
    
    if (categoryMeta[selectedCategory]) {
      categoryTitle.textContent = categoryMeta[selectedCategory].title;
      categorySubtitle.textContent = categoryMeta[selectedCategory].subtitle;
    }

    if (selectedCategory === 'all') {
      renderProducts(products);
    } else {
      const filtered = products.filter(p => p.category === selectedCategory);
      renderProducts(filtered);
    }
  });
});

// Search Bar Real-Time Filter
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
  
  let filtered = products;
  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }
  
  filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
  renderProducts(filtered);
});

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  const activeBtn = document.querySelector('.category-btn.active');
  const cat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
  
  if (categoryMeta[cat]) {
    categoryTitle.textContent = categoryMeta[cat].title;
    categorySubtitle.textContent = categoryMeta[cat].subtitle;
  }

  renderProducts(products.filter(p => cat === 'all' ? true : p.category === cat));
  updateCartUI();
});