// Sample data from application_data_json
const sampleItems = [
    {"id": 1, "name": "Tomatoes", "category": "vegetables", "unit": "kg"},
    {"id": 2, "name": "Onions", "category": "vegetables", "unit": "kg"},
    {"id": 3, "name": "Cooking Oil", "category": "oils", "unit": "liter"},
    {"id": 4, "name": "Paper Plates", "category": "packaging", "unit": "pack"},
    {"id": 5, "name": "Plastic Bags", "category": "packaging", "unit": "pack"},
    {"id": 6, "name": "Rice", "category": "grains", "unit": "kg"},
    {"id": 7, "name": "Wheat Flour", "category": "grains", "unit": "kg"},
    {"id": 8, "name": "Disposable Cups", "category": "packaging", "unit": "pack"}
];

const sampleSuppliers = [
    {"id": 1, "name": "Fresh Market Co.", "distance": "0.5 km", "rating": 4.8, "available": true, "items": [1, 2, 6, 7], "prices": {"1": 40, "2": 35, "6": 45, "7": 42}},
    {"id": 2, "name": "Quick Supply Hub", "distance": "1.2 km", "rating": 4.5, "available": true, "items": [3, 4, 5, 8], "prices": {"3": 120, "4": 25, "5": 15, "8": 30}},
    {"id": 3, "name": "Local Traders", "distance": "0.8 km", "rating": 4.6, "available": false, "items": [1, 2, 3], "prices": {"1": 38, "2": 33, "3": 118}},
    {"id": 4, "name": "Bulk Essentials", "distance": "2.1 km", "rating": 4.7, "available": true, "items": [4, 5, 6, 7, 8], "prices": {"4": 22, "5": 12, "6": 43, "7": 40, "8": 28}}
];

const sampleOrders = [
    {"id": 1, "vendorName": "Ravi's Food Stall", "items": [{"name": "Tomatoes", "quantity": 5, "price": 40}], "status": "preparing", "total": 200, "supplier": "Fresh Market Co."},
    {"id": 2, "vendorName": "Street Corner Snacks", "items": [{"name": "Paper Plates", "quantity": 3, "price": 25}, {"name": "Disposable Cups", "quantity": 2, "price": 30}], "status": "ready", "total": 135, "supplier": "Quick Supply Hub"}
];

// Application state
let currentUser = {
    role: null,
    phone: null,
    authenticated: false
};

let selectedItems = [];
let cart = [];
let currentOrder = null;
let currentRating = 0;

// OTP system variables
let generatedOTP = null;
let otpDisplayTimeout = null;

console.log('ð VendorConnect JavaScript Loading...');

// Global functions for inline event handlers
window.selectVendorRole = function() {
    console.log('â Vendor button clicked (inline handler)');
    selectRole('vendor');
};

window.selectSupplierRole = function() {
    console.log('â Supplier button clicked (inline handler)');
    selectRole('supplier');
};

window.showLoginPage = function() {
    console.log('ð Login link clicked');
    showPage('login');
};

window.showAbout = function() {
    alert('About VendorConnect: Connecting street vendors with trusted suppliers across India.');
};

window.showHowItWorks = function() {
    alert('How it works:\n1. Select your role (Vendor/Supplier)\n2. Sign up with phone number\n3. Vendors: Browse and order from suppliers\n4. Suppliers: List items and manage orders\n5. Track orders in real-time');
};

// Initialize app - Multiple initialization strategies
function initializeApp() {
    console.log('ð± Showing landing page...');
    showPage('landing');
    updateBottomNav();
    
    // Add backup initialization after short delay
    setTimeout(() => {
        console.log('ð Running backup initialization...');
        setupEventListenersBackup();
    }, 500);
}

function setupEventListenersBackup() {
    console.log('ð§ Setting up backup event listeners...');
    
    // Try to find and attach event listeners again
    const vendorBtn = document.querySelector('.vendor-btn');
    const supplierBtn = document.querySelector('.supplier-btn');
    
    if (vendorBtn && !vendorBtn.hasAttribute('data-listener-attached')) {
        vendorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('â Vendor button clicked (backup)');
            selectRole('vendor');
        });
        vendorBtn.setAttribute('data-listener-attached', 'true');
        console.log('ð§ Vendor button listener attached');
    }
    
    if (supplierBtn && !supplierBtn.hasAttribute('data-listener-attached')) {
        supplierBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('â Supplier button clicked (backup)');
            selectRole('supplier');
        });
        supplierBtn.setAttribute('data-listener-attached', 'true');
        console.log('ð§ Supplier button listener attached');
    }
}

// Multiple DOM ready handlers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('ð DOM Content Loaded');
        initializeApp();
        setupEventListeners();
        loadUserSession();
    });
} else {
    console.log('ð DOM Already Ready');
    initializeApp();
    setupEventListeners();
    loadUserSession();
}

// Fallback initialization
window.addEventListener('load', function() {
    console.log('ð Window Load Event');
    if (!document.querySelector('.vendor-btn[data-listener-attached]')) {
        console.log('ð Running fallback initialization...');
        setupEventListenersBackup();
    }
});

function setupEventListeners() {
    console.log('ð§ Setting up primary event listeners...');
    
    // Use event delegation for more reliable event handling
    document.body.addEventListener('click', function(e) {
        // Handle vendor button clicks
        if (e.target.matches('.vendor-btn') || e.target.closest('.vendor-btn')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('â Vendor button clicked (delegation)');
            selectRole('vendor');
            return;
        }
        
        // Handle supplier button clicks
        if (e.target.matches('.supplier-btn') || e.target.closest('.supplier-btn')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('â Supplier button clicked (delegation)');
            selectRole('supplier');
            return;
        }
        
        // Handle navigation links
        if (e.target.matches('[data-page]') || e.target.closest('[data-page]')) {
            e.preventDefault();
            const element = e.target.matches('[data-page]') ? e.target : e.target.closest('[data-page]');
            const page = element.dataset.page;
            console.log('ð Navigation clicked:', page);
            
            if (page === 'login') {
                showPage('login');
            } else if (page === 'about') {
                showAbout();
            } else if (page === 'how-it-works') {
                showHowItWorks();
            }
            return;
        }
        
        // Handle bottom navigation
        if (e.target.matches('.nav-item') || e.target.closest('.nav-item')) {
            e.preventDefault();
            const navItem = e.target.matches('.nav-item') ? e.target : e.target.closest('.nav-item');
            const page = navItem.dataset.page;
            if (page) {
                handleBottomNavClick(page);
            }
            return;
        }
    });

    // Auth form
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuth);
    }

    // Role tabs in login
    const roleTabs = document.querySelectorAll('.role-tab');
    roleTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchRoleTab(tab.dataset.role);
        });
    });

    // Other event listeners...
    setupOtherEventListeners();
    
    console.log('â Primary event listeners setup complete');
}

function setupOtherEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Vendor dashboard
    const proceedBtn = document.getElementById('proceedToSuppliers');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', proceedToSuppliers);
    }

    // Item checkboxes
    const itemCheckboxes = document.querySelectorAll('input[data-item]');
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedItems);
    });

    // Voice search
    const voiceSearchBtn = document.getElementById('voiceSearch');
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('click', handleVoiceSearch);
    }

    // Filters
    setupFilters();

    // Cart functionality
    const placeOrderBtn = document.getElementById('placeOrder');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }

    // Order tracking
    const goToRatingBtn = document.getElementById('goToRating');
    if (goToRatingBtn) {
        goToRatingBtn.addEventListener('click', () => showPage('rating'));
    }

    // Rating system
    setupRatingSystem();

    // Submit rating
    const submitRatingBtn = document.getElementById('submitRating');
    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', submitRating);
    }

    // Supplier dashboard tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Update inventory
    const updateInventoryBtn = document.getElementById('updateInventory');
    if (updateInventoryBtn) {
        updateInventoryBtn.addEventListener('click', updateInventory);
    }

    // Delivery options
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', updateDeliveryFee);
    });

    // Search functionality
    document.addEventListener('input', function(e) {
        if (e.target.id === 'itemSearch') {
            const searchTerm = e.target.value.toLowerCase();
            const itemCheckboxes = document.querySelectorAll('.item-checkbox');
            
            itemCheckboxes.forEach(checkbox => {
                const itemName = checkbox.querySelector('span').textContent.toLowerCase();
                
                if (itemName.includes(searchTerm)) {
                    checkbox.style.display = 'flex';
                } else {
                    checkbox.style.display = 'none';
                }
            });
        }
    });

    // Handle window resize for responsive design
    window.addEventListener('resize', function() {
        const navMenu = document.getElementById('navMenu');
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
        }
    });
}

function generateOTP() {
    console.log('ð OTP Generation Started');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('â OTP Generated:', otp);
    return otp;
}

function displayOTPTemporarily(otp) {
    console.log('ð± Displaying OTP on screen temporarily');
    
    // Remove any existing OTP display
    const existingDisplay = document.getElementById('tempOtpDisplay');
    if (existingDisplay) {
        existingDisplay.remove();
    }
    
    // Create temporary OTP display element
    const otpDisplay = document.createElement('div');
    otpDisplay.id = 'tempOtpDisplay';
    otpDisplay.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #26C281;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        animation: slideDown 0.3s ease-out;
        max-width: 90%;
        box-sizing: border-box;
    `;
    otpDisplay.innerHTML = `
        <div>ð Demo OTP for Testing</div>
        <div style="font-size: 24px; margin: 8px 0; letter-spacing: 2px;">${otp}</div>
        <div style="font-size: 14px; opacity: 0.9;">This will disappear in 10 seconds</div>
    `;
    
    // Add animation keyframes if not already present
    if (!document.getElementById('otpAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'otpAnimationStyles';
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            }
            @media (max-width: 480px) {
                #tempOtpDisplay {
                    left: 16px !important;
                    right: 16px !important;
                    transform: none !important;
                }
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-20px); opacity: 0; }
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(otpDisplay);
    
    // Clear any existing timeout
    if (otpDisplayTimeout) {
        clearTimeout(otpDisplayTimeout);
    }
    
    // Remove the display after 10 seconds
    otpDisplayTimeout = setTimeout(() => {
        if (otpDisplay && otpDisplay.parentNode) {
            otpDisplay.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                if (otpDisplay && otpDisplay.parentNode) {
                    otpDisplay.parentNode.removeChild(otpDisplay);
                }
            }, 300);
        }
    }, 10000);
}

function loadUserSession() {
    const savedUser = sessionStorage.getItem('vendorConnectUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.authenticated) {
            const dashboardPage = currentUser.role === 'vendor' ? 'vendor-dashboard' : 'supplier-dashboard';
            showPage(dashboardPage);
            updateBottomNav();
        }
    }
}

function saveUserSession() {
    sessionStorage.setItem('vendorConnectUser', JSON.stringify(currentUser));
}

function selectRole(role) {
    console.log('ð¤ Selecting role:', role);
    currentUser.role = role;
    showPage('login');
    switchRoleTab(role);
}

function switchRoleTab(role) {
    console.log('ð Switching role tab to:', role);
    currentUser.role = role;
    
    const tabs = document.querySelectorAll('.role-tab');
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.role === role);
    });
}

function handleAuth(e) {
    e.preventDefault();
    console.log('ð Authentication process started');
    
    const phoneInput = document.getElementById('phoneInput');
    const otpInput = document.getElementById('otpInput');
    const otpGroup = document.getElementById('otpGroup');
    const submitBtn = document.getElementById('authSubmit');
    
    if (otpGroup.classList.contains('hidden')) {
        // Send OTP step
        console.log('ð± Send OTP step initiated');
        
        if (phoneInput.value.length < 10) {
            console.log('â Invalid phone number entered');
            alert('Please enter a valid phone number (at least 10 digits)');
            return;
        }
        
        console.log('ð Phone number validated:', phoneInput.value);
        
        // Generate new OTP
        generatedOTP = generateOTP();
        
        // Display OTP in multiple ways for demo
        console.log('ð¨ IMPORTANT - Your OTP is:', generatedOTP);
        console.log('ð Please use this OTP to complete login:', generatedOTP);
        
        // Alert popup with OTP
        alert(`ð OTP Generated!\n\nYour OTP is: ${generatedOTP}\n\nThis is a demo - the OTP is also shown in console and on screen.`);
        
        // Display OTP on screen temporarily
        displayOTPTemporarily(generatedOTP);
        
        // Show OTP input form and update UI
        otpGroup.classList.remove('hidden');
        submitBtn.textContent = 'Verify OTP';
        phoneInput.disabled = true;
        
        // Add resend OTP button if it doesn't exist
        let resendBtn = document.getElementById('resendOtpBtn');
        if (!resendBtn) {
            resendBtn = document.createElement('button');
            resendBtn.id = 'resendOtpBtn';
            resendBtn.type = 'button';
            resendBtn.className = 'btn btn--outline btn--sm';
            resendBtn.textContent = 'Resend OTP';
            resendBtn.style.marginTop = '8px';
            resendBtn.onclick = resendOTP;
            otpGroup.appendChild(resendBtn);
        }
        
        // Focus on OTP input
        setTimeout(() => {
            otpInput.focus();
        }, 100);
        
        console.log('â OTP sent! Check console or demo message above');
        
    } else {
        // Verify OTP step
        console.log('ð OTP Verification Started');
        console.log('ð¢ User entered OTP:', otpInput.value);
        console.log('ð¯ Expected OTP:', generatedOTP);
        
        if (!otpInput.value || otpInput.value.length !== 6) {
            console.log('â Invalid OTP format');
            alert('Please enter a 6-digit OTP');
            return;
        }
        
        if (otpInput.value !== generatedOTP) {
            console.log('â OTP verification failed');
            alert(`Invalid OTP. Please try again.\n\nHint: Check console or the demo message for the correct OTP: ${generatedOTP}`);
            otpInput.value = '';
            otpInput.focus();
            return;
        }
        
        console.log('â OTP verification successful!');
        
        // Clear OTP from memory
        generatedOTP = null;
        
        // Clear temporary OTP display if still showing
        const tempDisplay = document.getElementById('tempOtpDisplay');
        if (tempDisplay) {
            tempDisplay.remove();
        }
        
        // Authentication successful
        currentUser.phone = phoneInput.value;
        currentUser.authenticated = true;
        saveUserSession();
        
        console.log('ð User authenticated successfully');
        console.log('ð¤ User role:', currentUser.role);
        console.log('ð± User phone:', currentUser.phone);
        
        const dashboardPage = currentUser.role === 'vendor' ? 'vendor-dashboard' : 'supplier-dashboard';
        showPage(dashboardPage);
        updateBottomNav();
        
        // Reset form for next use
        phoneInput.disabled = false;
        phoneInput.value = '';
        otpInput.value = '';
        otpGroup.classList.add('hidden');
        submitBtn.textContent = 'Send OTP';
        
        // Remove resend button
        const resendBtn = document.getElementById('resendOtpBtn');
        if (resendBtn) {
            resendBtn.remove();
        }
        
        if (currentUser.role === 'supplier') {
            loadSupplierOrders();
        }
    }
}

function resendOTP() {
    console.log('ð Resend OTP requested');
    
    // Generate new OTP
    generatedOTP = generateOTP();
    
    // Clear OTP input
    const otpInput = document.getElementById('otpInput');
    if (otpInput) {
        otpInput.value = '';
        otpInput.focus();
    }
    
    // Display new OTP in multiple ways
    console.log('ð NEW OTP Generated:', generatedOTP);
    alert(`ð New OTP Generated!\n\nYour new OTP is: ${generatedOTP}`);
    displayOTPTemporarily(generatedOTP);
    
    console.log('â New OTP sent successfully');
}

function showPage(pageId) {
    console.log('ð Showing page:', pageId);
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.remove('hidden');
            console.log('â Now showing:', page.id);
        } else {
            page.classList.add('hidden');
        }
    });
    
    // Update cart display when showing cart page
    if (pageId === 'cart') {
        updateCartDisplay();
    }
}

function updateBottomNav() {
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
        bottomNav.style.display = currentUser.authenticated ? 'flex' : 'none';
    }
}

// Additional utility functions for the complete application
function updateSelectedItems() {
    const checkboxes = document.querySelectorAll('input[data-item]:checked');
    selectedItems = Array.from(checkboxes).map(cb => parseInt(cb.dataset.item));
    
    const proceedBtn = document.getElementById('proceedToSuppliers');
    if (proceedBtn) {
        proceedBtn.disabled = selectedItems.length === 0;
    }
}

function proceedToSuppliers() {
    if (selectedItems.length === 0) {
        alert('Please select at least one item');
        return;
    }
    
    showPage('supplier-discovery');
    loadSuppliers();
}

function loadSuppliers() {
    const supplierGrid = document.getElementById('supplierGrid');
    if (!supplierGrid) return;
    
    const filteredSuppliers = sampleSuppliers.filter(supplier => {
        return supplier.items.some(itemId => selectedItems.includes(itemId));
    });
    
    supplierGrid.innerHTML = filteredSuppliers.map(supplier => {
        const availableItems = supplier.items.filter(itemId => selectedItems.includes(itemId));
        const itemNames = availableItems.map(itemId => {
            const item = sampleItems.find(i => i.id === itemId);
            return item ? item.name : '';
        }).filter(name => name);
        
        return `
            <div class="supplier-card" data-supplier-id="${supplier.id}">
                <div class="supplier-header">
                    <div class="supplier-info">
                        <h4>${supplier.name}</h4>
                        <div class="supplier-meta">
                            ð ${supplier.distance} â¢ â­ ${supplier.rating}
                        </div>
                    </div>
                    <div class="supplier-status ${supplier.available ? 'status-available' : 'status-unavailable'}">
                        ${supplier.available ? 'Available' : 'Closed'}
                    </div>
                </div>
                
                <div class="supplier-items">
                    <h5>Available Items:</h5>
                    <div class="item-tags">
                        ${itemNames.map(name => `<span class="item-tag">${name}</span>`).join('')}
                    </div>
                </div>
                
                <div class="supplier-actions">
                    <button class="btn btn--secondary btn--sm" onclick="viewSupplierItems(${supplier.id})">
                        View Items
                    </button>
                    <button class="btn btn--primary btn--sm" onclick="addSupplierToCart(${supplier.id})" 
                            ${!supplier.available ? 'disabled' : ''}>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function setupFilters() {
    const filters = ['priceFilter', 'distanceFilter', 'ratingFilter', 'availableNowFilter'];
    
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    loadSuppliers();
}

function viewSupplierItems(supplierId) {
    const supplier = sampleSuppliers.find(s => s.id === supplierId);
    if (!supplier) return;
    
    const availableItems = supplier.items.filter(itemId => selectedItems.includes(itemId));
    const itemDetails = availableItems.map(itemId => {
        const item = sampleItems.find(i => i.id === itemId);
        const price = supplier.prices[itemId.toString()];
        return `${item.name}: â¹${price} per ${item.unit}`;
    }).join('\n');
    
    alert(`${supplier.name} - Available Items:\n\n${itemDetails}`);
}

function addSupplierToCart(supplierId) {
    const supplier = sampleSuppliers.find(s => s.id === supplierId);
    if (!supplier || !supplier.available) return;
    
    const availableItems = supplier.items.filter(itemId => selectedItems.includes(itemId));
    
    availableItems.forEach(itemId => {
        const item = sampleItems.find(i => i.id === itemId);
        const price = supplier.prices[itemId.toString()];
        
        const existingCartItem = cart.find(c => c.itemId === itemId && c.supplierId === supplierId);
        
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cart.push({
                itemId: itemId,
                supplierId: supplierId,
                itemName: item.name,
                supplierName: supplier.name,
                price: price,
                unit: item.unit,
                quantity: 1
            });
        }
    });
    
    alert(`Items added to cart from ${supplier.name}`);
    updateCartDisplay();
    showPage('cart');
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        if (cartSubtotal) cartSubtotal.textContent = 'â¹0';
        if (cartTotal) cartTotal.textContent = 'â¹20';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.itemName}</div>
                <div class="cart-item-supplier">from ${item.supplierName}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <div class="cart-item-price">â¹${item.price * item.quantity}</div>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = document.querySelector('input[name="delivery"]:checked')?.value === 'delivery' ? 20 : 0;
    const total = subtotal + deliveryFee;
    
    if (cartSubtotal) cartSubtotal.textContent = `â¹${subtotal}`;
    if (cartTotal) cartTotal.textContent = `â¹${total}`;
}

function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartDisplay();
    }
}

function updateDeliveryFee() {
    updateCartDisplay();
}

function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = document.querySelector('input[name="delivery"]:checked')?.value === 'delivery' ? 20 : 0;
    const total = subtotal + deliveryFee;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    
    currentOrder = {
        id: Date.now(),
        items: [...cart],
        total: total,
        status: 'preparing',
        paymentMethod: paymentMethod,
        timestamp: new Date()
    };
    
    cart = [];
    
    alert(`Order placed successfully! Total: â¹${total}`);
    showPage('order-tracking');
    simulateOrderProgress();
}

function simulateOrderProgress() {
    const statuses = ['preparing', 'out-for-delivery', 'delivered'];
    let currentStatusIndex = 0;
    
    const interval = setInterval(() => {
        currentStatusIndex++;
        if (currentStatusIndex < statuses.length) {
            updateOrderStatus(statuses[currentStatusIndex]);
        } else {
            clearInterval(interval);
        }
    }, 10000);
}

function updateOrderStatus(status) {
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach((item, index) => {
        if (index <= getStatusIndex(status)) {
            item.classList.add('active');
        }
    });
}

function getStatusIndex(status) {
    const statuses = ['placed', 'preparing', 'out-for-delivery', 'delivered'];
    return statuses.indexOf(status);
}

function setupRatingSystem() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.rating);
            updateStarDisplay();
        });
        
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(rating);
        });
    });
    
    const starRating = document.getElementById('starRating');
    if (starRating) {
        starRating.addEventListener('mouseleave', () => {
            highlightStars(currentRating);
        });
    }
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function updateStarDisplay() {
    highlightStars(currentRating);
}

function submitRating() {
    if (currentRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    const reviewText = document.getElementById('reviewText').value;
    
    alert(`Thank you for your ${currentRating}-star rating!`);
    
    currentRating = 0;
    highlightStars(0);
    document.getElementById('reviewText').value = '';
    
    const dashboardPage = currentUser.role === 'vendor' ? 'vendor-dashboard' : 'supplier-dashboard';
    showPage(dashboardPage);
}

function switchTab(tabName) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    if (tabName === 'orders') {
        loadSupplierOrders();
    }
}

function loadSupplierOrders() {
    const ordersContainer = document.getElementById('supplierOrders');
    if (!ordersContainer) return;
    
    ordersContainer.innerHTML = sampleOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="status status--${order.status === 'preparing' ? 'warning' : 'success'}">${order.status}</span>
            </div>
            <div class="order-info">
                <p><strong>Vendor:</strong> ${order.vendorName}</p>
                <p><strong>Total:</strong> â¹${order.total}</p>
            </div>
            <div class="order-items">
                <h5>Items:</h5>
                ${order.items.map(item => `
                    <p>${item.name} x${item.quantity} - â¹${item.price * item.quantity}</p>
                `).join('')}
            </div>
            <div class="order-actions">
                ${order.status === 'preparing' ? `
                    <button class="btn btn--accept btn--sm" onclick="updateSupplierOrderStatus(${order.id}, 'ready')">Ready</button>
                    <button class="btn btn--reject btn--sm" onclick="updateSupplierOrderStatus(${order.id}, 'rejected')">Reject</button>
                ` : `
                    <button class="btn btn--primary btn--sm" onclick="updateSupplierOrderStatus(${order.id}, 'delivered')">Mark Delivered</button>
                `}
            </div>
        </div>
    `).join('');
}

function updateSupplierOrderStatus(orderId, status) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        loadSupplierOrders();
        alert(`Order #${orderId} status updated to: ${status}`);
    }
}

function updateInventory() {
    const availableItems = document.querySelectorAll('.item-available:checked');
    let inventory = {};
    
    availableItems.forEach(item => {
        const itemId = item.dataset.item;
        const priceInput = document.querySelector(`.price-input[data-item="${itemId}"]`);
        const quantityInput = document.querySelector(`.quantity-input[data-item="${itemId}"]`);
        
        if (priceInput && quantityInput && priceInput.value && quantityInput.value) {
            inventory[itemId] = {
                price: parseFloat(priceInput.value),
                quantity: parseInt(quantityInput.value)
            };
        }
    });
    
    alert(`Inventory updated for ${Object.keys(inventory).length} items`);
}

function handleVoiceSearch() {
    alert('ð¤ Voice search activated! (This is a demo feature)');
}

function handleBottomNavClick(page) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    if (page === 'dashboard') {
        const dashboardPage = currentUser.role === 'vendor' ? 'vendor-dashboard' : 'supplier-dashboard';
        showPage(dashboardPage);
    } else if (page === 'orders') {
        if (currentUser.role === 'vendor') {
            showPage('order-tracking');
        } else {
            showPage('supplier-dashboard');
            switchTab('orders');
        }
    } else if (page === 'profile') {
        alert('Profile page coming soon!');
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Auto-save functionality
setInterval(() => {
    if (currentUser.authenticated) {
        saveUserSession();
    }
}, 30000);

console.log('â VendorConnect JavaScript Loaded Successfully');