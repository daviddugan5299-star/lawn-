// GreenSpace Products Page JavaScript

let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentSort = 'name';

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

function initializeProductsPage() {
    loadAllProducts();
    initializeFilters();
    initializeSorting();
    initializeProductModal();
    
    // Handle URL hash for direct category links
    const hash = window.location.hash.substring(1);
    if (hash && ['grass-seeds', 'lawn-tools', 'fertilizers', 'outdoor-decor'].includes(hash)) {
        filterProducts(hash);
        updateActiveFilter(hash);
    }
}

// Load all product data
function loadAllProducts() {
    allProducts = getAllProductsData();
    filteredProducts = [...allProducts];
    displayAllProducts();
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
            updateActiveFilter(category);
        });
    });
}

function filterProducts(category) {
    currentCategory = category;
    
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => product.category === category);
    }
    
    sortProducts();
    displayFilteredProducts();
}

function updateActiveFilter(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// Sorting functionality
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortProducts();
            displayFilteredProducts();
        });
    }
}

function sortProducts() {
    filteredProducts.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'popularity':
                return b.popularity - a.popularity;
            default:
                return 0;
        }
    });
}

// Display products
function displayAllProducts() {
    const categories = {
        'grass-seeds': allProducts.filter(p => p.category === 'grass-seeds'),
        'lawn-tools': allProducts.filter(p => p.category === 'lawn-tools'),
        'fertilizers': allProducts.filter(p => p.category === 'fertilizers'),
        'outdoor-decor': allProducts.filter(p => p.category === 'outdoor-decor')
    };
    
    Object.entries(categories).forEach(([category, products]) => {
        const grid = document.getElementById(`${category.replace('-', '')}Grid`);
        if (grid) {
            grid.innerHTML = products.map(product => createProductCard(product)).join('');
        }
    });
}

function displayFilteredProducts() {
    // Hide all sections first
    const sections = ['grass-seeds', 'lawn-tools', 'fertilizers', 'outdoor-decor'];
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
            sectionElement.style.display = currentCategory === 'all' || currentCategory === section ? 'block' : 'none';
        }
    });
    
    if (currentCategory !== 'all') {
        // Show filtered results in the specific category
        const grid = document.getElementById(`${currentCategory.replace('-', '')}Grid`);
        if (grid) {
            grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
        }
    } else {
        // Show all products in their respective sections
        displayAllProducts();
    }
}

function createProductCard(product) {
    const isOnSale = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = isOnSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden group">
            ${isOnSale ? `<div class="bg-red-500 text-white px-3 py-1 text-sm font-bold absolute top-4 left-4 rounded-full z-10">${discountPercent}% OFF</div>` : ''}
            
            <div class="product-image p-8 relative">
                <i class="${product.icon}"></i>
                ${!product.inStock ? '<div class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"><span class="text-white font-bold">Out of Stock</span></div>' : ''}
            </div>
            
            <div class="p-6">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="text-lg font-semibold text-forest group-hover:text-lawn transition-colors cursor-pointer" 
                        onclick="openProductModal('${product.id}')">${product.name}</h4>
                    <div class="flex items-center text-yellow-500">
                        ${generateStars(product.rating)}
                        <span class="text-sm text-gray-500 ml-1">(${product.reviews || 0})</span>
                    </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
                
                ${product.features ? `
                    <ul class="text-xs text-gray-500 mb-4">
                        ${product.features.slice(0, 2).map(feature => `<li class="flex items-center"><i class="fas fa-check text-green-500 mr-1"></i>${feature}</li>`).join('')}
                    </ul>
                ` : ''}
                
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold text-forest">$${product.price.toFixed(2)}</span>
                        ${isOnSale ? `<span class="text-sm text-gray-500 line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button onclick="openProductModal('${product.id}')" 
                                class="text-sage hover:text-lawn transition-colors p-2">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="bg-lawn text-white px-4 py-2 rounded-full hover:bg-forest transition-colors ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus mr-1"></i>
                            ${product.inStock ? 'Add' : 'Sold Out'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Product modal functionality
function initializeProductModal() {
    const modal = document.getElementById('productModal');
    const closeModal = document.getElementById('closeModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeProductModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }
}

function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    modalTitle.textContent = product.name;
    modalContent.innerHTML = createProductModalContent(product);
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function createProductModalContent(product) {
    const isOnSale = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = isOnSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="product-image bg-sage bg-opacity-10 rounded-xl p-8 flex items-center justify-center">
                <i class="${product.icon} text-6xl text-sage"></i>
            </div>
            
            <div>
                <div class="flex items-center space-x-2 mb-4">
                    <div class="flex items-center text-yellow-500">
                        ${generateStars(product.rating)}
                        <span class="text-sm text-gray-500 ml-2">(${product.reviews || 0} reviews)</span>
                    </div>
                    ${isOnSale ? `<span class="bg-red-500 text-white px-2 py-1 text-xs rounded">${discountPercent}% OFF</span>` : ''}
                </div>
                
                <div class="mb-4">
                    <span class="text-3xl font-bold text-forest">$${product.price.toFixed(2)}</span>
                    ${isOnSale ? `<span class="text-lg text-gray-500 line-through ml-2">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                
                <p class="text-gray-700 mb-6">${product.longDescription || product.description}</p>
                
                ${product.features ? `
                    <div class="mb-6">
                        <h4 class="font-semibold text-forest mb-2">Features:</h4>
                        <ul class="space-y-1">
                            ${product.features.map(feature => `<li class="flex items-center text-sm"><i class="fas fa-check text-green-500 mr-2"></i>${feature}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${product.specifications ? `
                    <div class="mb-6">
                        <h4 class="font-semibold text-forest mb-2">Specifications:</h4>
                        <ul class="space-y-1">
                            ${Object.entries(product.specifications).map(([key, value]) => `<li class="flex justify-between text-sm"><span class="text-gray-600">${key}:</span><span>${value}</span></li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="flex items-center space-x-4">
                    <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')}); closeProductModal();" 
                            class="bg-lawn text-white px-6 py-3 rounded-full font-semibold hover:bg-forest transition-colors flex-1 ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus mr-2"></i>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    
                    <button class="border border-sage text-sage px-6 py-3 rounded-full hover:bg-sage hover:text-white transition-colors">
                        <i class="fas fa-heart mr-2"></i>Wishlist
                    </button>
                </div>
                
                <div class="mt-6 text-sm text-gray-600">
                    <p><i class="fas fa-truck mr-2"></i>Free shipping on orders over $50</p>
                    <p><i class="fas fa-undo mr-2"></i>30-day return policy</p>
                    <p><i class="fas fa-shield-alt mr-2"></i>1-year warranty included</p>
                </div>
            </div>
        </div>
    `;
}

// Complete product data
function getAllProductsData() {
    return [
        // Grass Seeds
        {
            id: 'premium-grass-mix',
            name: 'Premium Grass Seed Mix',
            price: 29.99,
            originalPrice: 34.99,
            description: 'High-quality blend for lush, durable lawns',
            longDescription: 'Our premium grass seed mix is specially formulated for homeowners who want a lush, green lawn that can withstand heavy foot traffic and various weather conditions.',
            category: 'grass-seeds',
            icon: 'fas fa-seedling',
            rating: 5,
            reviews: 127,
            inStock: true,
            popularity: 95,
            features: [
                'Drought-resistant varieties',
                'Quick germination (7-14 days)',
                'Covers up to 2,000 sq ft',
                'All-season planting'
            ],
            specifications: {
                'Coverage': '2,000 sq ft',
                'Germination': '7-14 days',
                'Growth Rate': 'Fast',
                'Sun Requirements': 'Full sun to partial shade'
            }
        },
        {
            id: 'shade-tolerant-seed',
            name: 'Shade-Tolerant Grass Seed',
            price: 34.99,
            description: 'Perfect for areas with limited sunlight',
            longDescription: 'Specially designed for lawns that receive less than 6 hours of direct sunlight daily. Creates a beautiful, dense lawn in challenging conditions.',
            category: 'grass-seeds',
            icon: 'fas fa-leaf',
            rating: 4,
            reviews: 89,
            inStock: true,
            popularity: 82,
            features: [
                'Thrives in shade',
                'Dense growth pattern',
                'Disease resistant',
                'Low maintenance'
            ],
            specifications: {
                'Coverage': '1,500 sq ft',
                'Germination': '10-21 days',
                'Sun Requirements': '2-6 hours daily',
                'Growth Rate': 'Moderate'
            }
        },
        {
            id: 'kentucky-bluegrass',
            name: 'Kentucky Bluegrass Premium',
            price: 39.99,
            description: 'Classic cool-season grass for northern climates',
            longDescription: 'The gold standard of cool-season grasses. Creates a beautiful, dense lawn with excellent self-repair capabilities.',
            category: 'grass-seeds',
            icon: 'fas fa-seedling',
            rating: 5,
            reviews: 203,
            inStock: true,
            popularity: 88,
            features: [
                'Self-repairing capability',
                'Rich green color',
                'Soft texture',
                'Cold hardy'
            ],
            specifications: {
                'Coverage': '1,800 sq ft',
                'Germination': '14-30 days',
                'Climate': 'Cool season',
                'Maintenance': 'Moderate'
            }
        },
        {
            id: 'bermuda-grass-seed',
            name: 'Bermuda Grass Seed',
            price: 27.99,
            description: 'Heat and drought tolerant warm-season grass',
            category: 'grass-seeds',
            icon: 'fas fa-sun',
            rating: 4,
            reviews: 156,
            inStock: true,
            popularity: 79,
            features: [
                'Excellent heat tolerance',
                'Traffic resistant',
                'Fast establishment',
                'Self-spreading'
            ]
        },

        // Lawn Tools
        {
            id: 'professional-mower',
            name: 'Professional Self-Propelled Mower',
            price: 399.99,
            originalPrice: 459.99,
            description: 'Self-propelled mower with mulching capability',
            longDescription: 'Professional-grade self-propelled lawn mower designed for efficiency and reliability. Features a powerful engine and precision cutting deck.',
            category: 'lawn-tools',
            icon: 'fas fa-tools',
            rating: 5,
            reviews: 94,
            inStock: true,
            popularity: 91,
            features: [
                '21-inch cutting deck',
                'Variable speed control',
                'Mulching and bagging options',
                '3-year warranty'
            ],
            specifications: {
                'Engine': '196cc 4-cycle',
                'Cutting Width': '21 inches',
                'Height Adjustment': '7 positions',
                'Drive System': 'Self-propelled'
            }
        },
        {
            id: 'cordless-trimmer',
            name: 'Cordless String Trimmer',
            price: 149.99,
            description: 'Battery-powered trimmer for precise edging',
            category: 'lawn-tools',
            icon: 'fas fa-cut',
            rating: 4,
            reviews: 67,
            inStock: true,
            popularity: 76,
            features: [
                '40V lithium battery',
                'Adjustable handle',
                'Auto-feed line',
                '45-minute runtime'
            ]
        },
        {
            id: 'leaf-blower',
            name: 'Cordless Leaf Blower',
            price: 119.99,
            description: 'Powerful cordless blower for yard cleanup',
            category: 'lawn-tools',
            icon: 'fas fa-wind',
            rating: 4,
            reviews: 52,
            inStock: true,
            popularity: 73,
            features: [
                '120 MPH air speed',
                'Lightweight design',
                'Variable speed trigger',
                'Quick-release battery'
            ]
        },
        {
            id: 'sprinkler-system',
            name: 'Smart Irrigation System',
            price: 249.99,
            description: 'Automated watering system with smart controls',
            category: 'lawn-tools',
            icon: 'fas fa-tint',
            rating: 5,
            reviews: 38,
            inStock: false,
            popularity: 85,
            features: [
                'WiFi connectivity',
                'Weather-based scheduling',
                '8 programmable zones',
                'Mobile app control'
            ]
        },

        // Fertilizers
        {
            id: 'organic-lawn-food',
            name: 'Organic Lawn Food',
            price: 24.99,
            description: 'Natural nutrients for healthy grass growth',
            longDescription: 'Slow-release organic fertilizer that feeds your lawn naturally while improving soil health and promoting deep root growth.',
            category: 'fertilizers',
            icon: 'fas fa-flask',
            rating: 5,
            reviews: 145,
            inStock: true,
            popularity: 87,
            features: [
                '100% organic ingredients',
                'Slow-release formula',
                'Safe for pets and children',
                'Improves soil health'
            ],
            specifications: {
                'N-P-K Ratio': '10-3-8',
                'Coverage': '5,000 sq ft',
                'Application Rate': '3 lbs per 1,000 sq ft',
                'Feeding Duration': '8-10 weeks'
            }
        },
        {
            id: 'winter-fertilizer',
            name: 'Winter Prep Fertilizer',
            price: 28.99,
            description: 'Special formula for fall and winter lawn care',
            category: 'fertilizers',
            icon: 'fas fa-snowflake',
            rating: 4,
            reviews: 78,
            inStock: true,
            popularity: 69,
            features: [
                'Winterizing formula',
                'Promotes root growth',
                'Cold weather protection',
                'Early spring green-up'
            ]
        },
        {
            id: 'weed-feed',
            name: 'Weed & Feed Fertilizer',
            price: 32.99,
            description: 'Fertilizes lawn while controlling weeds',
            category: 'fertilizers',
            icon: 'fas fa-shield-alt',
            rating: 4,
            reviews: 112,
            inStock: true,
            popularity: 81,
            features: [
                'Feeds and weeds in one step',
                'Controls dandelions and clover',
                'Long-lasting weed prevention',
                'Quick-acting formula'
            ]
        },
        {
            id: 'starter-fertilizer',
            name: 'New Lawn Starter Fertilizer',
            price: 19.99,
            description: 'Perfect for new grass and overseeding',
            category: 'fertilizers',
            icon: 'fas fa-rocket',
            rating: 5,
            reviews: 89,
            inStock: true,
            popularity: 74,
            features: [
                'High phosphorus content',
                'Quick establishment',
                'Root development booster',
                'Gentle on new seedlings'
            ]
        },

        // Outdoor Decor
        {
            id: 'solar-pathway-lights',
            name: 'Solar Pathway Lights Set',
            price: 79.99,
            description: 'Beautiful LED lights for garden paths',
            category: 'outdoor-decor',
            icon: 'fas fa-lightbulb',
            rating: 4,
            reviews: 134,
            inStock: true,
            popularity: 83,
            features: [
                'Set of 8 lights',
                'Auto on/off sensor',
                'Weatherproof design',
                '8-hour runtime'
            ]
        },
        {
            id: 'garden-statue',
            name: 'Decorative Garden Statue',
            price: 129.99,
            originalPrice: 149.99,
            description: 'Elegant centerpiece for your landscape',
            category: 'outdoor-decor',
            icon: 'fas fa-chess-king',
            rating: 5,
            reviews: 67,
            inStock: true,
            popularity: 71,
            features: [
                'Hand-crafted design',
                'Weather-resistant finish',
                '18-inch height',
                'Stable base included'
            ]
        },
        {
            id: 'bird-bath',
            name: 'Classic Stone Bird Bath',
            price: 89.99,
            description: 'Attract birds to your garden',
            category: 'outdoor-decor',
            icon: 'fas fa-dove',
            rating: 4,
            reviews: 45,
            inStock: true,
            popularity: 68,
            features: [
                'Natural stone appearance',
                'Easy assembly',
                'Drainage hole included',
                '24-inch diameter'
            ]
        },
        {
            id: 'planter-set',
            name: 'Decorative Planter Set',
            price: 59.99,
            description: 'Set of 3 decorative planters in different sizes',
            category: 'outdoor-decor',
            icon: 'fas fa-seedling',
            rating: 4,
            reviews: 91,
            inStock: true,
            popularity: 77,
            features: [
                'Set of 3 different sizes',
                'Drainage holes included',
                'UV-resistant material',
                'Modern design'
            ]
        }
    ];
}

// Utility function for star ratings
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Make functions globally available
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;