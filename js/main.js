// GreenSpace Lawn & Garden - Main JavaScript

// Global variables
let cart = JSON.parse(localStorage.getItem('greenspace_cart')) || [];
let products = [];
let testimonials = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeNavigation();
    initializeCart();
    initializeSearch();
    initializeNewsletter();
    
    // Load data if on homepage
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        loadFeaturedProducts();
        loadTestimonials();
    }
    
    // Smooth scrolling for anchor links
    initializeSmoothScrolling();
}

// Navigation functionality
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Shopping cart functionality
function initializeCart() {
    updateCartCount();
    
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Product removed from cart', 'info');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('greenspace_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                <div class="w-16 h-16 bg-sage bg-opacity-20 rounded-lg flex items-center justify-center">
                    <i class="${item.icon} text-sage text-xl"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${item.name}</h4>
                    <p class="text-xs text-gray-600">$${item.price.toFixed(2)} each</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300">-</button>
                        <span class="text-sm">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                                class="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300">+</button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-sm">$${itemTotal.toFixed(2)}</p>
                    <button onclick="removeFromCart('${item.id}')" 
                            class="text-red-500 hover:text-red-700 text-xs">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('open');
        cartOverlay.classList.remove('hidden');
        updateCartDisplay();
        document.body.style.overflow = 'hidden';
    }
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                
                if (query.length > 2) {
                    performSearch(query);
                } else if (searchResults) {
                    searchResults.classList.add('hidden');
                }
            }, 300);
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (searchResults && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }
}

function performSearch(query) {
    // This would typically make an API call to search products
    // For demo purposes, we'll search through our sample products
    const sampleProducts = getSampleProducts();
    const results = sampleProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No products found</div>';
    } else {
        searchResults.innerHTML = results.map(product => `
            <div class="search-result-item" onclick="navigateToProduct('${product.id}')">
                <div class="flex items-center space-x-3">
                    <i class="${product.icon} text-sage"></i>
                    <div>
                        <div class="font-medium">${product.name}</div>
                        <div class="text-sm text-gray-600">$${product.price.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    searchResults.classList.remove('hidden');
}

function navigateToProduct(productId) {
    window.location.href = `products.html#${productId}`;
}

// Newsletter functionality
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                newsletterForm.reset();
            }, 1000);
        });
    }
}

// Load featured products for homepage
function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProducts');
    
    if (!featuredGrid) return;
    
    const sampleProducts = getSampleProducts().slice(0, 6);
    
    featuredGrid.innerHTML = sampleProducts.map(product => `
        <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="product-image p-8">
                <i class="${product.icon}"></i>
            </div>
            <div class="p-6">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="text-lg font-semibold text-forest">${product.name}</h4>
                    <div class="flex items-center text-yellow-500">
                        ${generateStars(product.rating)}
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">${product.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold text-forest">$${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                            class="bg-lawn text-white px-4 py-2 rounded-full hover:bg-forest transition-colors">
                        <i class="fas fa-cart-plus mr-1"></i>Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load testimonials for homepage
function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonials');
    
    if (!testimonialsGrid) return;
    
    const sampleTestimonials = [
        {
            name: "Sarah Johnson",
            location: "Springfield",
            rating: 5,
            text: "GreenSpace transformed my backyard! Their grass seed blend gave me the lush lawn I've always wanted. Excellent quality and fast shipping."
        },
        {
            name: "Mike Chen",
            location: "Oak Valley",
            rating: 5,
            text: "Professional-grade tools at great prices. The lawn mower I purchased has been working perfectly for two years. Highly recommend!"
        },
        {
            name: "Emily Rodriguez",
            location: "Garden Heights",
            rating: 5,
            text: "The fertilizer program they recommended worked wonders. My lawn has never looked healthier. Great customer service too!"
        }
    ];
    
    testimonialsGrid.innerHTML = sampleTestimonials.map(testimonial => `
        <div class="testimonial-card bg-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-lawn rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ${testimonial.name.charAt(0)}
                </div>
                <div class="ml-3">
                    <h4 class="font-semibold text-forest">${testimonial.name}</h4>
                    <p class="text-sm text-sage">${testimonial.location}</p>
                </div>
            </div>
            <div class="flex items-center mb-3">
                ${generateStars(testimonial.rating)}
            </div>
            <p class="text-gray-700 italic">"${testimonial.text}"</p>
        </div>
    `).join('');
}

// Utility functions
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function initializeSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Sample products data
function getSampleProducts() {
    return [
        {
            id: 'grass-seed-premium',
            name: 'Premium Grass Seed Mix',
            price: 29.99,
            description: 'High-quality blend for lush, durable lawns',
            category: 'grass-seeds',
            icon: 'fas fa-seedling',
            rating: 5,
            inStock: true
        },
        {
            id: 'lawn-mower-pro',
            name: 'Professional Lawn Mower',
            price: 299.99,
            description: 'Self-propelled mower with mulching capability',
            category: 'lawn-tools',
            icon: 'fas fa-tools',
            rating: 4,
            inStock: true
        },
        {
            id: 'organic-fertilizer',
            name: 'Organic Lawn Fertilizer',
            price: 24.99,
            description: 'Natural nutrients for healthy grass growth',
            category: 'fertilizers',
            icon: 'fas fa-flask',
            rating: 5,
            inStock: true
        },
        {
            id: 'garden-statue',
            name: 'Decorative Garden Statue',
            price: 89.99,
            description: 'Beautiful accent piece for your landscape',
            category: 'outdoor-decor',
            icon: 'fas fa-tree',
            rating: 4,
            inStock: true
        },
        {
            id: 'sprinkler-system',
            name: 'Automatic Sprinkler System',
            price: 149.99,
            description: 'Efficient watering system with timer',
            category: 'lawn-tools',
            icon: 'fas fa-tint',
            rating: 5,
            inStock: true
        },
        {
            id: 'shade-grass-seed',
            name: 'Shade-Tolerant Grass Seed',
            price: 34.99,
            description: 'Perfect for areas with limited sunlight',
            category: 'grass-seeds',
            icon: 'fas fa-leaf',
            rating: 4,
            inStock: true
        }
    ];
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;