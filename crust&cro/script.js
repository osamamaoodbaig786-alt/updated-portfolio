let cartCount = 0;
let totalPrice = 0;
let cartItems = []; 
let isUserLoggedIn = false; // Track login state

const EMAILJS_SERVICE_ID = "service_jegvhpp";
const EMAILJS_TEMPLATE_ID = "template_szy2jsc";
const WHATSAPP_NUMBER = "923054122965";

// User Session Data
let currentUser = {
    name: "Valued Customer",
    email: "osamamaoodbaig786@gmail.com"
};

const menuData = [
    // --- Somewhat Local Category ---
    { 
        name: 'Chicken Tikka Pizza', 
        category: 'local', 
        price: 1390, 
        desc: 'Traditional chicken tikka boti, red onions, fresh coriander, mozzarella cheese.', 
        img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Chicken Fajita Pizza', 
        category: 'local', 
        price: 1390, 
        desc: 'Tender fajita chicken, onions, fresh bell peppers, jalapenos & melted mozzarella.', 
        img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Beef Pepperoni Pizza', 
        category: 'local', 
        price: 1450, 
        desc: 'Loaded with classic spicy beef pepperoni slices and double mozzarella cheese.', 
        img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Mughlai Delight Pizza', 
        category: 'local', 
        price: 1490, 
        desc: 'Rich Mughlai creamy chicken, green chilies, onions, topped with garlic drizzle.', 
        img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80' 
    },

    // --- Somewhat Sooper Category ---
    { 
        name: 'Cheesy Monster Crust', 
        category: 'sooper', 
        price: 1690, 
        desc: 'Quad-cheese blend, pepperoni, stuffed cheese rim & rich garlic butter glaze.', 
        img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'BBQ Smoked Chicken', 
        category: 'sooper', 
        price: 1590, 
        desc: 'Smoked chicken breast, smoky BBQ sauce drizzle, sweet corn, red onions.', 
        img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'The Ranchero Special', 
        category: 'sooper', 
        price: 1550, 
        desc: 'Creamy ranch sauce base, grilled chicken, mushrooms, jalapenos & herbs.', 
        img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Meat Supreme Craze', 
        category: 'sooper', 
        price: 1750, 
        desc: 'Beef pepperoni, chicken sausages, smoked chicken, olives, mushrooms & extra cheese.', 
        img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80' 
    },

    // --- Starters & Burgers Category ---
    { 
        name: 'Bazinga Zinger Burger', 
        category: 'starters', 
        price: 590, 
        desc: 'Crispy fried zinger chicken fillet with spicy mayo, cheese & iceberg lettuce.', 
        img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Smash Beef Cheeseburger', 
        category: 'starters', 
        price: 690, 
        desc: 'Double smashed juicy beef patty, cheddar cheese slice & caramelized onions.', 
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Cheezy Loaded Fries', 
        category: 'starters', 
        price: 490, 
        desc: 'Crispy potato fries topped with liquid cheddar cheese sauce & jalapenos.', 
        img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Cheesy Garlic Breadsticks', 
        category: 'starters', 
        price: 390, 
        desc: 'Freshly baked warm breadsticks brushed with garlic butter & mozzarella.', 
        img: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Hot Buffalo Wings (6 Pcs)', 
        category: 'starters', 
        price: 450, 
        desc: 'Crispy fried chicken wings coated in spicy buffalo sauce with garlic dip.', 
        img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80' 
    },

    // --- Desserts & Ice Cream Shakes Category ---
    { 
        name: 'Oreo Ice Cream Shake', 
        category: 'desserts', 
        price: 420, 
        desc: 'Thick creamy vanilla ice cream blended with crushed Oreo cookies & chocolate drizzle.', 
        img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Nutella Fudge Shake', 
        category: 'desserts', 
        price: 480, 
        desc: 'Rich Nutella blended with chocolate ice cream, topped with whipped cream.', 
        img: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Strawberry Crunch Shake', 
        category: 'desserts', 
        price: 390, 
        desc: 'Fresh strawberry ice cream shake blended with real strawberry syrup.', 
        img: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Molten Lava Cake', 
        category: 'desserts', 
        price: 450, 
        desc: 'Warm chocolate cake with a rich gooey molten chocolate center.', 
        img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Nutella Pizza Sticks', 
        category: 'desserts', 
        price: 590, 
        desc: 'Warm crispy crust topped with rich Nutella hazelnut glaze & chocolate chips.', 
        img: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80' 
    },
    { 
        name: 'Brownie Fudge Sundae', 
        category: 'desserts', 
        price: 490, 
        desc: 'Fudgy chocolate brownie topped with vanilla ice cream scoop & hot chocolate syrup.', 
        img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80' 
    }
];

window.onload = function() {
    displayMenu(menuData);
    setupPaymentToggle();
};

// Toggle Mobile Menu Drawer
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    if (drawer.style.display === 'flex') {
        drawer.style.display = 'none';
    } else {
        drawer.style.display = 'flex';
    }
}

function displayMenu(items) {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;
    menuContainer.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('menu-item-card');
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="menu-details">
                <h3>${item.name}</h3>
                <p class="desc">${item.desc}</p>
                <div class="price-row">
                    <span class="price">PKR ${item.price.toLocaleString()}</span>
                    <button class="add-to-cart" onclick="addToCart('${item.name}', ${item.price})">Add +</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

function filterMenu(category, event) {
    if (category === 'all') {
        displayMenu(menuData);
    } else {
        const filtered = menuData.filter(item => item.category === category);
        displayMenu(filtered);
    }

    document.querySelectorAll('.cat-card').forEach(card => card.classList.remove('active'));
    if (event) {
        event.currentTarget.classList.add('active');
    }
}

function addToCart(itemName, price) {
    if (!isUserLoggedIn) {
        alert('Please Login or Sign Up first to place your order! 🍕');
        openAuthModal('login');
        return;
    }

    cartCount++;
    totalPrice += price;
    
    const existingItem = cartItems.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name: itemName, price: price, quantity: 1 });
    }

    document.getElementById('cart-count').innerText = cartCount;
    document.getElementById('total-bill').innerText = `PKR ${totalPrice.toLocaleString()}`;
    
    document.getElementById('main-ordering-content').scrollIntoView({ behavior: 'smooth' });
}

function setupPaymentToggle() {
    const codRadio = document.getElementById('cod-radio');
    const cardRadio = document.getElementById('card-radio');
    const cardDetailsContainer = document.getElementById('card-details-container');

    if (codRadio && cardRadio && cardDetailsContainer) {
        codRadio.addEventListener('change', () => {
            if (codRadio.checked) {
                cardDetailsContainer.style.display = 'none';
            }
        });

        cardRadio.addEventListener('change', () => {
            if (cardRadio.checked) {
                cardDetailsContainer.style.display = 'block';
            }
        });
    }
}

function openAuthModal(type) {
    document.getElementById('authModal').classList.add('active');
    switchTab(type);
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchTab(type) {
    const loginForm = document.getElementById('loginFormContainer');
    const signupForm = document.getElementById('signupFormContainer');

    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

function handleAuth(e, actionType) {
    e.preventDefault();

    if (actionType === 'Login') {
        const loginEmail = document.getElementById('login-email').value;
        currentUser.email = loginEmail || currentUser.email;
        currentUser.name = loginEmail.split('@')[0] || "Valued Customer";
    } else {
        const signupName = document.getElementById('signup-name').value;
        const signupEmail = document.getElementById('signup-email').value;
        currentUser.name = signupName || currentUser.name;
        currentUser.email = signupEmail || currentUser.email;
    }

    isUserLoggedIn = true;
    closeAuthModal();

    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-profile-nav').style.display = 'flex';
    document.getElementById('main-ordering-content').style.display = 'block';

    alert(`${actionType} successful! You can now complete your order below. 🚀`);
}

function resetCartState() {
    cartCount = 0;
    totalPrice = 0;
    cartItems = [];
    document.getElementById('cart-count').innerText = cartCount;
    document.getElementById('total-bill').innerText = `PKR 0`;
    document.getElementById('delivery-address').value = '';
    
    const codRadio = document.getElementById('cod-radio');
    if (codRadio) codRadio.checked = true;
    const cardDetailsContainer = document.getElementById('card-details-container');
    if (cardDetailsContainer) cardDetailsContainer.style.display = 'none';
}

function logoutUser() {
    isUserLoggedIn = false;
    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('user-profile-nav').style.display = 'none';
    document.getElementById('main-ordering-content').style.display = 'none';
    
    resetCartState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function sendOrderEmailNotification(orderDetails) {
    const templateParams = {
        user_name: orderDetails.userName,
        user_email: orderDetails.userEmail,
        order_items: orderDetails.itemsFormatted,
        delivery_address: orderDetails.address,
        payment_method: orderDetails.paymentMethod,
        total_bill: `PKR ${orderDetails.totalBill.toLocaleString()}`
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then((response) => {
            console.log("SUCCESS! Email sent.", response.status, response.text);
        })
        .catch((error) => {
            console.error("FAILED to send email:", error);
        });
}

function sendOrderToWhatsApp(orderDetails) {
    const message = 
`*🔥 New Order Placed on Crust & Co.!*
----------------------------------
*Customer Name:* ${orderDetails.userName}
*Items:*
${orderDetails.itemsFormatted}
----------------------------------
*Address:* ${orderDetails.address}
*Payment Method:* ${orderDetails.paymentMethod}
*Total Bill:* PKR ${orderDetails.totalBill.toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 1200);
}

function placeOrder() {
    if (cartCount === 0) {
        alert('Please add at least one item to your cart!');
        return;
    }

    const addressInput = document.getElementById('delivery-address');
    const address = addressInput.value.trim().toLowerCase();
    
    if (!address) {
        alert('Please enter your delivery address!');
        addressInput.focus();
        return;
    }

    const allowedBranches = ['pia road', 'dha', 'johar town'];
    const isLahore = address.includes('lahore');
    const hasValidBranch = allowedBranches.some(branch => address.includes(branch));

    if (!isLahore || !hasValidBranch) {
        alert('📍 Crust & Co. Branches:\nWe are exclusively located in Lahore at:\n1. PIA Road\n2. DHA\n3. Johar Town\n\nYou can visit us physically or order for delivery within these areas only!');
        addressInput.focus();
        return;
    }

    const cardRadio = document.getElementById('card-radio');
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (cardRadio && cardRadio.checked) {
        const cardNumber = document.getElementById('card-number').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        const cardCvv = document.getElementById('card-cvv').value.trim();

        if (!cardNumber || !cardExpiry || !cardCvv) {
            alert('Please fill in all the card details before proceeding.');
            return;
        }
    }

    const itemsFormatted = cartItems
        .map(item => `- ${item.name} x${item.quantity} (PKR ${(item.price * item.quantity).toLocaleString()})`)
        .join("\n");

    const orderPayload = {
        userName: currentUser.name,
        userEmail: currentUser.email,
        address: address,
        paymentMethod: paymentMethod === 'Cash' ? 'Cash on Delivery' : 'Credit/Debit Card',
        itemsFormatted: itemsFormatted,
        totalBill: totalPrice
    };

    sendOrderEmailNotification(orderPayload);
    sendOrderToWhatsApp(orderPayload);

    const itemsListContainer = document.getElementById('success-items-list');
    itemsListContainer.innerHTML = '';
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.name}</strong> x ${item.quantity} - PKR ${(item.price * item.quantity).toLocaleString()}`;
        itemsListContainer.appendChild(li);
    });

    document.getElementById('success-address').innerText = address;
    document.getElementById('success-total').innerText = `PKR ${totalPrice.toLocaleString()}`;
    document.getElementById('success-payment').innerText = paymentMethod === 'Cash' ? 'Cash on Delivery 💵' : 'Credit/Debit Card 💳';

    document.getElementById('successModal').classList.add('active');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    resetCartState();
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function logoutUserFromSuccess() {
    document.getElementById('successModal').classList.remove('active');
    logoutUser();
}