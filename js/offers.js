// GreenSpace Offers Page JavaScript

let flashSaleItems = [];
let seasonalOffers = [];
let clearanceItems = [];

// Initialize offers page
document.addEventListener('DOMContentLoaded', function() {
    initializeOffersPage();
});

function initializeOffersPage() {
    loadOffers();
    initializeCountdown();
    displayFlashSaleItems();
    displaySeasonalOffers();
    displayClearanceItems();
}

// Load all offers data
function loadOffers() {
    flashSaleItems = getFlashSaleData();
    seasonalOffers = getSeasonalOffersData();
    clearanceItems = getClearanceData();
}

// Countdown timer for flash sale
function initializeCountdown() {
    // Set flash sale end date (2 days, 15 hours, 42 minutes, 30 seconds from now)
    const now = new Date();
    const flashSaleEnd = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000) + (15 * 60 * 60 * 1000) + (42 * 60 * 1000) + (30 * 1000));
    
    updateCountdown(flashSaleEnd);
    
    // Update countdown every second
    setInterval(() => updateCountdown(flashSaleEnd), 1000);
}

function updateCountdown(endDate) {
    const now = new Date();
    const timeLeft = endDate - now;
    
    if (timeLeft <= 0) {
        // Sale has ended
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Display flash sale items
function displayFlashSaleItems() {
    const grid = document.getElementById('flashSaleGrid');
    if (!grid) return;
    
    grid.innerHTML = flashSaleItems.map(item => createFlashSaleCard(item)).join('');
}

function createFlashSaleCard(item) {
    const discountPercent = Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100);
    
    return `
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden relative transform hover:scale-105 transition-all duration-300">
            <div class="absolute top-4 left-4 z-10">
                <div class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    ${discountPercent}% OFF
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-red-100 to-orange-100 h-48 flex items-center justify-center">
                <i class="${item.icon} text-4xl text-red-600"></i>
            </div>
            
            <div class="p-6">
                <h3 class="text-lg font-bold text-forest mb-2">${item.name}</h3>
                <p class="text-gray-600 text-sm mb-4">${item.description}</p>
                
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <span class="text-2xl font-bold text-red-600">$${item.salePrice.toFixed(2)}</span>
                        <span class="text-sm text-gray-500 line-through ml-2">$${item.originalPrice.toFixed(2)}</span>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-500">You Save</div>
                        <div class="text-sm font-bold text-green-600">$${(item.originalPrice - item.salePrice).toFixed(2)}</div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="flex justify-between text-xs mb-1">
                        <span>Stock Level</span>
                        <span>${item.stock} left</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-red-500 h-2 rounded-full" style="width: ${Math.min((item.stock / 20) * 100, 100)}%"></div>
                    </div>
                </div>
                
                <button onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
                        class="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    <i class="fas fa-bolt mr-1"></i>Grab This Deal
                </button>
            </div>
        </div>
    `;
}

// Display seasonal offers
function displaySeasonalOffers() {
    const grid = document.getElementById('seasonalOffersGrid');
    if (!grid) return;
    
    grid.innerHTML = seasonalOffers.map(item => createSeasonalOfferCard(item)).join('');
}

function createSeasonalOfferCard(item) {
    const discountPercent = item.originalPrice ? Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100) : 0;
    
    return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="bg-gradient-to-br from-blue-100 to-indigo-100 h-32 flex items-center justify-center relative">
                <i class="${item.icon} text-3xl text-blue-600"></i>
                ${item.badge ? `<div class="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">${item.badge}</div>` : ''}
            </div>
            
            <div class="p-4">
                <h4 class="text-lg font-semibold text-forest mb-2">${item.name}</h4>
                <p class="text-gray-600 text-sm mb-3">${item.description}</p>
                
                <div class="flex items-center justify-between mb-3">
                    ${item.originalPrice ? `
                        <div>
                            <span class="text-xl font-bold text-forest">$${item.salePrice.toFixed(2)}</span>
                            <span class="text-sm text-gray-500 line-through ml-1">$${item.originalPrice.toFixed(2)}</span>
                        </div>
                        <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Save ${discountPercent}%</span>
                    ` : `
                        <span class="text-xl font-bold text-forest">$${item.salePrice.toFixed(2)}</span>
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">${item.badge || 'Special Price'}</span>
                    `}
                </div>
                
                <button onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
                        class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Display clearance items
function displayClearanceItems() {
    const grid = document.getElementById('clearanceGrid');
    if (!grid) return;
    
    grid.innerHTML = clearanceItems.map(item => createClearanceCard(item)).join('');
}

function createClearanceCard(item) {
    const discountPercent = Math.round(((item.originalPrice - item.clearancePrice) / item.originalPrice) * 100);
    
    return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="bg-gradient-to-br from-gray-100 to-gray-200 h-32 flex items-center justify-center relative">
                <i class="${item.icon} text-3xl text-gray-600"></i>
                <div class="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                    CLEARANCE
                </div>
                <div class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    ${discountPercent}% OFF
                </div>
            </div>
            
            <div class="p-4">
                <h4 class="text-md font-semibold text-forest mb-2">${item.name}</h4>
                <p class="text-gray-600 text-xs mb-3">${item.description}</p>
                
                <div class="mb-3">
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-bold text-orange-600">$${item.clearancePrice.toFixed(2)}</span>
                        <span class="text-xs text-gray-500 line-through">$${item.originalPrice.toFixed(2)}</span>
                    </div>
                    <div class="text-xs text-green-600 font-medium">Save $${(item.originalPrice - item.clearancePrice).toFixed(2)}</div>
                </div>
                
                <div class="mb-3">
                    <div class="text-xs text-red-600 font-medium">Only ${item.stock} left!</div>
                    <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div class="bg-red-500 h-1 rounded-full" style="width: ${Math.min((item.stock / 10) * 100, 100)}%"></div>
                    </div>
                </div>
                
                <button onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
                        class="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
                    Final Sale
                </button>
            </div>
        </div>
    `;
}

// Bundle functionality
function addBundleToCart(bundleId) {
    const bundles = {
        'winter-bundle': {
            id: 'winter-bundle',
            name: 'Winter Lawn Care Bundle',
            price: 64.99,
            originalPrice: 89.96,
            description: 'Complete winter preparation kit',
            icon: 'fas fa-snowflake',
            category: 'bundles',
            inStock: true
        },
        'starter-kit': {
            id: 'starter-kit',
            name: 'New Lawn Starter Kit',
            price: 99.99,
            originalPrice: 124.96,
            description: 'Everything needed for a new lawn',
            icon: 'fas fa-seedling',
            category: 'bundles',
            inStock: true
        },
        'pro-bundle': {
            id: 'pro-bundle',
            name: 'Pro Maintenance Bundle',
            price: 299.99,
            originalPrice: 369.94,
            description: 'Professional lawn care equipment set',
            icon: 'fas fa-tools',
            category: 'bundles',
            inStock: true
        }
    };
    
    const bundle = bundles[bundleId];
    if (bundle) {
        addToCart(bundle);
        showNotification(`${bundle.name} added to cart!`, 'success');
    }
}

// Flash sale data
function getFlashSaleData() {
    return [
        {
            id: 'flash-mower',
            name: 'Professional Self-Propelled Mower',
            description: 'High-performance mower with mulching capability',
            originalPrice: 459.99,
            salePrice: 299.99,
            icon: 'fas fa-tools',
            stock: 8,
            category: 'lawn-tools',
            inStock: true
        },
        {
            id: 'flash-fertilizer-pack',
            name: 'Organic Fertilizer 4-Pack',
            description: 'Premium organic lawn food bundle',
            originalPrice: 99.96,
            salePrice: 59.97,
            icon: 'fas fa-flask',
            stock: 15,
            category: 'fertilizers',
            inStock: true
        },
        {
            id: 'flash-seed-mix',
            name: 'Premium Grass Seed Collection',
            description: '3 varieties of premium grass seed',
            originalPrice: 89.97,
            salePrice: 54.99,
            icon: 'fas fa-seedling',
            stock: 12,
            category: 'grass-seeds',
            inStock: true
        }
    ];
}

// Seasonal offers data
function getSeasonalOffersData() {
    return [
        {
            id: 'winter-fertilizer-special',
            name: 'Winter Prep Fertilizer',
            description: 'Special potassium-rich formula for winter hardiness',
            originalPrice: 32.99,
            salePrice: 24.99,
            icon: 'fas fa-snowflake',
            badge: 'Winter Special',
            category: 'fertilizers',
            inStock: true
        },
        {
            id: 'dormant-grass-seed',
            name: 'Dormant Seeding Mix',
            description: 'Perfect for winter overseeding projects',
            originalPrice: 45.99,
            salePrice: 34.99,
            icon: 'fas fa-leaf',
            badge: 'Cold Hardy',
            category: 'grass-seeds',
            inStock: true
        },
        {
            id: 'leaf-removal-tool',
            name: 'Professional Leaf Blower',
            description: 'Clear leaves efficiently before winter',
            originalPrice: 159.99,
            salePrice: 119.99,
            icon: 'fas fa-wind',
            badge: 'Season End',
            category: 'lawn-tools',
            inStock: true
        },
        {
            id: 'winter-cover',
            name: 'Lawn Protection Covers',
            description: 'Protect high-traffic areas during winter',
            salePrice: 39.99,
            icon: 'fas fa-shield-alt',
            badge: 'New Product',
            category: 'outdoor-decor',
            inStock: true
        },
        {
            id: 'soil-test-kit',
            name: 'Professional Soil Test Kit',
            description: 'Test soil before spring preparation',
            originalPrice: 24.99,
            salePrice: 19.99,
            icon: 'fas fa-vial',
            badge: 'Essential Tool',
            category: 'tools',
            inStock: true
        },
        {
            id: 'winter-spreader',
            name: 'Broadcast Spreader',
            description: 'Even application of winter treatments',
            originalPrice: 79.99,
            salePrice: 59.99,
            icon: 'fas fa-cog',
            badge: 'Pro Grade',
            category: 'lawn-tools',
            inStock: true
        }
    ];
}

// Clearance data
function getClearanceData() {
    return [
        {
            id: 'clearance-summer-seed',
            name: 'Summer Grass Mix',
            description: 'Warm-season blend - end of season',
            originalPrice: 39.99,
            clearancePrice: 19.99,
            icon: 'fas fa-sun',
            stock: 6,
            category: 'grass-seeds',
            inStock: true
        },
        {
            id: 'clearance-sprinkler',
            name: 'Oscillating Sprinkler',
            description: 'Basic lawn sprinkler - final sale',
            originalPrice: 29.99,
            clearancePrice: 14.99,
            icon: 'fas fa-tint',
            stock: 4,
            category: 'lawn-tools',
            inStock: true
        },
        {
            id: 'clearance-planters',
            name: 'Decorative Planters Set',
            description: 'Seasonal planters - last chance',
            originalPrice: 59.99,
            clearancePrice: 24.99,
            icon: 'fas fa-seedling',
            stock: 3,
            category: 'outdoor-decor',
            inStock: true
        },
        {
            id: 'clearance-hose',
            name: 'Garden Hose 50ft',
            description: 'Standard garden hose - clearance',
            originalPrice: 34.99,
            clearancePrice: 17.99,
            icon: 'fas fa-water',
            stock: 8,
            category: 'tools',
            inStock: true
        }
    ];
}

// Make functions globally available
window.addBundleToCart = addBundleToCart;