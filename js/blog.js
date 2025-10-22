// GreenSpace Blog JavaScript

let blogArticles = [];
let filteredArticles = [];
let currentCategory = 'all';
let articlesDisplayed = 6;
const articlesPerLoad = 6;

// Initialize blog page
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogPage();
});

function initializeBlogPage() {
    loadBlogArticles();
    initializeCategoryFilters();
    initializeArticleModal();
    initializeLoadMore();
}

// Load all blog articles
function loadBlogArticles() {
    blogArticles = getBlogArticlesData();
    filteredArticles = [...blogArticles];
    displayBlogArticles();
}

// Category filter functionality
function initializeCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterBlogArticles(category);
            updateActiveFilter(category);
        });
    });
}

function filterBlogArticles(category) {
    currentCategory = category;
    articlesDisplayed = articlesPerLoad;
    
    if (category === 'all') {
        filteredArticles = [...blogArticles];
    } else {
        filteredArticles = blogArticles.filter(article => article.category === category);
    }
    
    displayBlogArticles();
    updateLoadMoreButton();
}

function updateActiveFilter(category) {
    const filterButtons = document.querySelectorAll('.category-filter');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// Display blog articles
function displayBlogArticles() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    const articlesToShow = filteredArticles.slice(0, articlesDisplayed);
    
    blogGrid.innerHTML = articlesToShow.map(article => createBlogCard(article)).join('');
    
    // Add fade-in animation
    setTimeout(() => {
        const cards = blogGrid.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }, 50);
}

function createBlogCard(article) {
    const readingTime = Math.ceil(article.content.split(' ').length / 200);
    
    return `
        <article class="blog-card">
            <div class="bg-gradient-to-br from-sage to-mint h-48 flex items-center justify-center text-white">
                <i class="${article.icon} text-4xl"></i>
            </div>
            
            <div class="p-6">
                <div class="flex items-center space-x-2 mb-3">
                    <span class="bg-${getCategoryColor(article.category)} text-white px-2 py-1 rounded text-xs font-medium">${getCategoryLabel(article.category)}</span>
                    <span class="text-sage text-xs">
                        <i class="fas fa-calendar mr-1"></i>${formatDate(article.date)}
                    </span>
                </div>
                
                <h3 class="text-xl font-serif font-bold text-forest mb-3 line-clamp-2">${article.title}</h3>
                
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">${article.excerpt}</p>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-lawn rounded-full flex items-center justify-center text-white text-xs font-bold">
                            ${article.author.charAt(0)}
                        </div>
                        <div class="text-xs">
                            <div class="text-forest font-medium">${article.author}</div>
                            <div class="text-sage">${readingTime} min read</div>
                        </div>
                    </div>
                    
                    <button onclick="openArticle('${article.id}')" 
                            class="bg-lawn text-white px-4 py-2 rounded-full text-sm hover:bg-forest transition-colors">
                        Read More
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            articlesDisplayed += articlesPerLoad;
            displayBlogArticles();
            updateLoadMoreButton();
        });
    }
    
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    if (articlesDisplayed >= filteredArticles.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
        loadMoreBtn.textContent = `Load More (${filteredArticles.length - articlesDisplayed} remaining)`;
    }
}

// Article modal functionality
function initializeArticleModal() {
    const modal = document.getElementById('articleModal');
    const closeModal = document.getElementById('closeArticleModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeArticleModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeArticleModal();
            }
        });
    }
}

function openArticle(articleId) {
    const article = blogArticles.find(a => a.id === articleId);
    if (!article) return;
    
    const modal = document.getElementById('articleModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalCategories = document.getElementById('modalCategories');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalTitle || !modalMeta || !modalCategories || !modalContent) return;
    
    // Set modal content
    modalTitle.textContent = article.title;
    
    modalCategories.innerHTML = `
        <span class="bg-${getCategoryColor(article.category)} text-white px-3 py-1 rounded-full text-sm font-medium">
            ${getCategoryLabel(article.category)}
        </span>
    `;
    
    const readingTime = Math.ceil(article.content.split(' ').length / 200);
    modalMeta.innerHTML = `
        <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-lawn rounded-full flex items-center justify-center text-white text-sm font-bold">
                ${article.author.charAt(0)}
            </div>
            <span>${article.author}</span>
        </div>
        <span><i class="fas fa-calendar mr-1"></i>${formatDate(article.date)}</span>
        <span><i class="fas fa-clock mr-1"></i>${readingTime} min read</span>
    `;
    
    modalContent.innerHTML = formatArticleContent(article.content);
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Utility functions
function getCategoryColor(category) {
    const colors = {
        'seasonal': 'orange-500',
        'lawn-care': 'green-600',
        'gardening': 'emerald-500',
        'tools': 'blue-600',
        'pest-control': 'red-500'
    };
    return colors[category] || 'gray-500';
}

function getCategoryLabel(category) {
    const labels = {
        'seasonal': 'Seasonal Tips',
        'lawn-care': 'Lawn Care',
        'gardening': 'Gardening',
        'tools': 'Tools & Equipment',
        'pest-control': 'Pest Control'
    };
    return labels[category] || category;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatArticleContent(content) {
    // Convert markdown-like content to HTML
    return content
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/## (.*)/g, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\- (.*)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.*)$/gm, '<p>$1</p>')
        .replace(/<p><h/g, '<h')
        .replace(/<\/h3><\/p>/g, '</h3>')
        .replace(/<\/h4><\/p>/g, '</h4>')
        .replace(/<p><ul>/g, '<ul>')
        .replace(/<\/ul><\/p>/g, '</ul>')
        .replace(/<p><\/p>/g, '');
}

// Blog articles data
function getBlogArticlesData() {
    return [
        {
            id: 'winter-prep',
            title: 'Winter Lawn Preparation: Essential Steps for Spring Success',
            excerpt: 'Preparing your lawn for winter is crucial for ensuring a healthy, vibrant lawn come spring. Learn the essential steps every homeowner should take before the first frost.',
            content: `Winter lawn preparation is one of the most important steps you can take to ensure a healthy, beautiful lawn come spring. Many homeowners make the mistake of neglecting their lawn once the growing season ends, but proper winter preparation can make the difference between a lawn that struggles in spring and one that thrives.

## Fall Fertilization

Apply a winterizing fertilizer in late fall, typically between October and November, depending on your location. This fertilizer should be high in potassium, which helps grass plants develop stronger root systems and improves cold tolerance.

- Choose a fertilizer with an N-P-K ratio of approximately 13-25-12
- Apply 4-6 weeks before the ground freezes
- Water thoroughly after application if no rain is expected

## Final Mowing and Cleanup

Your last mow of the season should leave grass at about 2-2.5 inches tall. Grass that's too long can mat down under snow and develop fungal diseases, while grass that's cut too short is more susceptible to winter damage.

**Essential cleanup tasks:**
- Remove all fallen leaves from the lawn surface
- Pick up sticks, toys, and other debris
- Clean and store lawn equipment properly
- Drain and store hoses to prevent freezing

## Aeration and Overseeding

Late summer to early fall is the perfect time for core aeration, especially for cool-season grasses. Aeration relieves soil compaction and allows nutrients, water, and air to reach the root zone more effectively.

If your lawn has thin or bare spots, overseeding immediately after aeration gives new grass seed the best chance to establish before winter.

## Winter Protection Tips

**For high-traffic areas:** Consider temporary fencing or markers to prevent foot traffic on frozen grass, which can cause permanent damage.

**Snow management:** Avoid piling snow from driveways and walkways on your lawn, especially if the snow contains road salt or ice-melting chemicals.

**Equipment maintenance:** Clean, sharpen, and properly store all lawn equipment. Change oil in gas-powered equipment and either run engines dry or add fuel stabilizer.

By following these winter preparation steps, you'll give your lawn the best possible chance to emerge healthy and vigorous when spring arrives. Remember, a little effort in fall saves a lot of work and expense in spring!`,
            category: 'seasonal',
            author: 'Michael Thompson',
            date: '2024-12-15',
            icon: 'fas fa-snowflake'
        },
        {
            id: 'spring-lawn-care',
            title: 'Spring Lawn Care Checklist: Getting Your Grass Ready for Summer',
            excerpt: 'Spring is the perfect time to set your lawn up for success. Follow this comprehensive checklist to ensure a lush, healthy lawn all season long.',
            content: `Spring lawn care is all about creating the foundation for a beautiful lawn throughout the growing season. The steps you take in early spring will determine how well your lawn performs during the heat of summer.

## Early Spring Tasks (March-April)

**Soil Testing:** Start with a soil test to determine pH and nutrient levels. Most grasses prefer a pH between 6.0-7.0. If your soil is too acidic or alkaline, spring is the time to make corrections.

**Dethatching:** If thatch buildup exceeds ½ inch, use a dethatching rake or power dethatcher to remove excess organic matter. This allows water, air, and nutrients to reach the soil.

**First Fertilization:** Apply a slow-release nitrogen fertilizer when grass begins actively growing. Look for a fertilizer with an N-P-K ratio around 20-5-10.

## Mid-Spring Tasks (April-May)

**Overseeding:** Fill in bare or thin spots with appropriate grass seed. Choose seed varieties that match your existing lawn and are suitable for your climate zone.

**Weed Control:** Apply pre-emergent herbicide before soil temperatures reach 55°F to prevent crabgrass and other annual weeds. For existing weeds, spot-treat with post-emergent herbicides.

**Irrigation Setup:** Test and repair your sprinkler system. Ensure proper coverage and adjust timers for spring watering needs.

## Late Spring Tasks (May-June)

**Mowing:** Begin regular mowing when grass reaches about 3 inches tall. Follow the one-third rule: never cut more than one-third of the grass blade at once.

**Deep Watering:** Establish a deep, infrequent watering schedule. Most lawns need 1-1.5 inches of water per week, including rainfall.

**Pest Monitoring:** Watch for signs of grubs, chinch bugs, or other lawn pests. Early detection and treatment are key to preventing major damage.

## Pro Tips for Spring Success

- **Timing matters:** Don't rush spring lawn care. Wait until soil is dry enough to walk on without leaving footprints.
- **Equipment maintenance:** Sharpen mower blades for clean cuts that heal quickly and resist disease.
- **Patience with new seed:** New grass seed can take 2-4 weeks to germinate, depending on variety and conditions.

By following this spring checklist, you'll create the ideal conditions for a thick, healthy lawn that can withstand summer stress and look great all season long.`,
            category: 'seasonal',
            author: 'Sarah Johnson',
            date: '2024-12-10',
            icon: 'fas fa-leaf'
        },
        {
            id: 'choosing-grass-seed',
            title: 'How to Choose the Right Grass Seed for Your Climate',
            excerpt: 'Not all grass seeds are created equal. Learn how to select the perfect grass variety for your specific climate zone and growing conditions.',
            content: `Choosing the right grass seed is one of the most important decisions you'll make for your lawn. The wrong variety can lead to years of frustration, while the right choice will give you a beautiful, low-maintenance lawn that thrives in your specific climate.

## Understanding Grass Types

**Cool-Season Grasses** grow best in northern climates with moderate summers and cold winters. They have two peak growing periods: spring and fall.

Popular varieties include:
- Kentucky Bluegrass: Dense, self-repairing, requires more water
- Tall Fescue: Drought-tolerant, durable, handles foot traffic well
- Fine Fescue: Shade-tolerant, low-maintenance, drought-resistant
- Perennial Ryegrass: Quick germination, good for overseeding

**Warm-Season Grasses** thrive in southern climates with hot summers. They grow most actively during summer months and go dormant in winter.

Popular varieties include:
- Bermuda Grass: Extremely durable, heat and drought tolerant
- Zoysia Grass: Dense, soft texture, good traffic tolerance
- St. Augustine Grass: Shade-tolerant, thick growth habit
- Centipede Grass: Low-maintenance, acidic soil tolerant

## Climate Zone Considerations

**Northern Zones (3-6):** Focus on cool-season varieties. Choose Kentucky Bluegrass for full sun areas, Fine Fescue for shade, and Tall Fescue for high-traffic areas.

**Transition Zone (6-8):** This challenging area can support both grass types. Tall Fescue and Zoysia are often the best choices for year-round performance.

**Southern Zones (8-11):** Warm-season grasses are essential. Bermuda for full sun and high traffic, St. Augustine for shade tolerance, Zoysia for premium appearance.

## Site-Specific Factors

**Sun vs. Shade:** Most grasses need 6+ hours of direct sunlight. For shady areas, choose shade-tolerant varieties like Fine Fescue (cool-season) or St. Augustine (warm-season).

**Traffic Levels:** High-traffic areas need durable grasses like Tall Fescue, Perennial Ryegrass, Bermuda, or Zoysia.

**Maintenance Preferences:** Low-maintenance options include Fine Fescue, Centipede Grass, and Buffalo Grass.

**Water Availability:** Drought-tolerant choices include Tall Fescue, Fine Fescue, Bermuda, and Zoysia.

## Seed Quality Matters

Always purchase certified seed from reputable suppliers. Check the seed label for:
- Purity percentage (should be 95%+)
- Germination rate (should be 85%+)
- Test date (within the last year)
- Weed seed content (should be minimal)

## Planting Tips

- **Timing:** Cool-season grasses in early fall or spring; warm-season grasses in late spring
- **Soil preparation:** Till, level, and amend soil before seeding
- **Seeding rate:** Follow package recommendations; over-seeding wastes seed and money
- **Watering:** Keep soil consistently moist until germination

Choosing the right grass seed is an investment in your property's value and your enjoyment of outdoor spaces. Take time to research and select the variety that best matches your climate, site conditions, and maintenance preferences.`,
            category: 'lawn-care',
            author: 'David Rodriguez',
            date: '2024-12-08',
            icon: 'fas fa-seedling'
        },
        {
            id: 'organic-lawn-care',
            title: 'Organic Lawn Care: Natural Methods for a Healthy Lawn',
            excerpt: 'Discover how to maintain a beautiful, healthy lawn using organic methods that are safe for your family, pets, and the environment.',
            content: `Organic lawn care focuses on building healthy soil and encouraging natural processes that create a resilient, beautiful lawn without synthetic chemicals. This approach takes patience but results in a more sustainable and environmentally friendly landscape.

## Building Healthy Soil

The foundation of organic lawn care is healthy soil. Healthy soil supports beneficial microorganisms, retains moisture better, and provides steady nutrition to grass plants.

**Soil Testing:** Test your soil pH and nutrient levels annually. Organic amendments work slowly, so understanding your soil's needs is crucial.

**Organic Matter:** Add compost, aged manure, or other organic materials to improve soil structure and nutrition. Top-dress with ¼ inch of compost twice yearly.

**Beneficial Microorganisms:** Use mycorrhizal inoculants and beneficial bacteria products to enhance soil biology.

## Natural Fertilization

Organic fertilizers release nutrients slowly, providing steady nutrition without the growth spurts that can stress grass plants.

**Compost:** The gold standard of organic fertilizers. Provides balanced nutrition and improves soil health.

**Organic Granular Fertilizers:** Look for products containing bone meal, blood meal, kelp meal, and other natural ingredients.

**Liquid Organic Fertilizers:** Fish emulsion, liquid kelp, and compost tea provide quick-acting nutrients for rapid green-up.

## Pest and Disease Management

Organic pest control focuses on prevention and natural solutions rather than synthetic pesticides.

**Beneficial Insects:** Encourage ladybugs, lacewings, and other beneficial insects that prey on lawn pests.

**Natural Predators:** Birds, toads, and spiders help control insect populations naturally.

**Organic Treatments:** 
- Neem oil for fungal diseases
- Beneficial nematodes for grub control
- Corn gluten meal as a natural pre-emergent herbicide
- Hand weeding for spot weed control

## Water Management

Efficient watering supports plant health while reducing disease pressure and water waste.

**Deep, Infrequent Watering:** Water deeply 1-2 times per week rather than daily shallow watering.

**Morning Watering:** Water early morning to reduce evaporation and disease pressure.

**Drought Tolerance:** Choose native or adapted grass varieties that require less water.

## Mowing Practices

Proper mowing strengthens grass and reduces weed pressure naturally.

**Height Matters:** Keep grass taller (3+ inches) to shade out weeds and develop deeper roots.

**Sharp Blades:** Clean cuts heal quickly and resist disease better than torn grass.

**Grasscycling:** Leave clippings on the lawn to return nutrients to the soil.

## Seasonal Organic Care

**Spring:** Apply compost, overseed thin areas, begin regular mowing.

**Summer:** Focus on proper watering, raise mowing height, spot-treat weeds.

**Fall:** Core aerate, overseed, apply organic winter fertilizer.

**Winter:** Plan next year's improvements, test soil, order organic amendments.

## Benefits of Organic Lawn Care

- **Environmental Protection:** No synthetic chemicals entering groundwater or harming beneficial insects
- **Family Safety:** Safe for children and pets to play on treated areas immediately
- **Long-term Health:** Builds soil that supports grass health for years
- **Cost Effective:** Reduced need for inputs over time as soil health improves

While organic lawn care requires patience and different techniques than conventional methods, the result is a healthier, more resilient lawn that contributes to environmental health. Start with soil improvement and gradually transition to fully organic methods for the best results.`,
            category: 'lawn-care',
            author: 'Michael Thompson',
            date: '2024-12-05',
            icon: 'fas fa-leaf'
        },
        {
            id: 'lawn-mower-maintenance',
            title: 'Essential Lawn Mower Maintenance for Peak Performance',
            excerpt: 'Keep your lawn mower running smoothly and extend its life with these essential maintenance tips that every homeowner should know.',
            content: `Regular lawn mower maintenance is essential for keeping your equipment running efficiently, extending its life, and ensuring a quality cut every time. A well-maintained mower not only performs better but also uses less fuel and requires fewer repairs.

## Pre-Season Maintenance Checklist

Before the first mow of the season, perform these essential tasks:

**Engine Oil:** Check oil level and change if dirty or if it's been more than 50 hours of operation. Use SAE 30 oil for most small engines, or 10W-30 for varying temperatures.

**Air Filter:** Clean or replace the air filter. A dirty filter reduces power and fuel efficiency. Paper filters should be replaced; foam filters can be cleaned and re-oiled.

**Spark Plug:** Remove and inspect the spark plug. Replace if the electrode is worn or if there's heavy carbon buildup. Gap should typically be 0.030 inches.

**Fuel System:** If fuel was left in the tank over winter, drain and refill with fresh gasoline. Add fuel stabilizer to prevent gum and varnish buildup.

## Blade Maintenance

Sharp mower blades are crucial for lawn health and mower performance.

**Blade Sharpening:** Sharpen blades at least once per season, more if you mow frequently. Dull blades tear grass rather than cutting cleanly, leading to brown tips and increased disease susceptibility.

**Balance Check:** After sharpening, ensure the blade is properly balanced. An unbalanced blade causes vibration and can damage the engine.

**Replacement:** Replace blades when they're worn thin, cracked, or have large nicks that can't be sharpened out.

## Regular Season Maintenance

**Weekly Checks:**
- Clean grass clippings from under the deck
- Check tire pressure (if applicable)
- Inspect for loose bolts or damaged parts
- Clean air intake screens

**Monthly Tasks:**
- Check and tighten all bolts
- Lubricate wheel bearings and pivot points
- Inspect drive belt for wear (self-propelled mowers)
- Check battery connections (electric start models)

## Deck Maintenance

The mower deck takes a beating from grass, moisture, and debris.

**Cleaning:** Clean the deck after each use to prevent grass buildup and corrosion. Use a putty knife to scrape stubborn debris.

**Rust Prevention:** Touch up any scratched or rusted areas with appropriate paint. Consider applying a deck coating for extra protection.

**Deck Level:** Ensure the deck is level for an even cut. Most decks should be ¼ to ½ inch lower in front than rear.

## End-of-Season Storage

Proper storage prevents problems and makes spring startup easier.

**Fuel System:** Either run the engine dry or add fuel stabilizer and run for a few minutes to circulate treated fuel.

**Oil Change:** Change oil before storage to remove contaminants that can damage the engine.

**Cleaning:** Thoroughly clean the entire mower, paying special attention to the deck and engine cooling fins.

**Storage Location:** Store in a dry location away from moisture and temperature extremes.

## Troubleshooting Common Issues

**Hard Starting:**
- Check fuel quality and spark plug
- Clean air filter
- Prime if equipped with primer bulb

**Uneven Cut:**
- Sharpen or replace blades
- Check tire pressure
- Level the deck
- Check for deck damage

**Excessive Vibration:**
- Check blade balance
- Tighten loose bolts
- Inspect for damaged parts

**Poor Performance:**
- Clean air filter
- Change oil if dirty
- Check blade sharpness
- Adjust engine RPM if necessary

## Professional Service

While many maintenance tasks can be done at home, consider professional service for:
- Engine repairs
- Transmission service
- Carburetor rebuilding
- Major blade balancing

Following this maintenance schedule will keep your mower running efficiently for many years. Regular care prevents costly repairs and ensures your lawn always gets the quality cut it deserves. Remember, a well-maintained mower is safer, more reliable, and provides better results than one that's neglected.`,
            category: 'tools',
            author: 'David Rodriguez',
            date: '2024-12-03',
            icon: 'fas fa-tools'
        },
        {
            id: 'summer-watering-guide',
            title: 'Summer Watering: How to Keep Your Lawn Green in Hot Weather',
            excerpt: 'Beat the summer heat with smart watering strategies that conserve water while keeping your lawn healthy and green all season long.',
            content: `Summer watering is both an art and a science. The goal is to maintain a healthy, green lawn while using water efficiently and avoiding the common mistakes that can actually harm your grass during hot weather.

## Understanding Water Needs

Most established lawns need about 1 to 1.5 inches of water per week, including rainfall. However, water needs vary based on:

**Grass Type:** Cool-season grasses may need more water in summer, while warm-season grasses are naturally more drought-tolerant.

**Soil Type:** Sandy soils drain quickly and need more frequent watering, while clay soils retain moisture longer but may need deeper watering sessions.

**Weather Conditions:** Hot, windy, or low-humidity conditions increase water loss through evaporation and transpiration.

**Lawn Age:** New lawns need more frequent, lighter watering; established lawns benefit from deep, infrequent watering.

## Timing Is Everything

**Best Time:** Water between 4:00-8:00 AM when temperatures are cooler and winds are calm. This reduces evaporation and allows grass to dry before evening, reducing disease risk.

**Avoid Evening Watering:** Watering in the evening keeps grass wet overnight, creating ideal conditions for fungal diseases.

**Midday Watering:** While not ideal due to evaporation, midday watering won't harm your lawn and is better than no water during drought conditions.

## Deep vs. Frequent Watering

**Deep Watering Benefits:**
- Encourages deep root growth
- Improves drought tolerance
- Reduces water waste through evaporation
- Decreases weed germination

**How to Water Deeply:**
- Apply ½ to ¾ inch of water per session
- Water 2-3 times per week maximum
- Use the "screwdriver test" – you should be able to push a screwdriver 6 inches into the soil after watering

## Efficient Watering Methods

**Sprinkler Systems:** Automatic systems provide consistent watering but need proper programming and maintenance.

**Sprinkler Heads:** Choose heads that produce larger water droplets, which penetrate better and evaporate less.

**Soaker Hoses:** Excellent for irregular areas and slopes; apply water slowly with minimal evaporation.

**Impact Sprinklers:** Good for large areas; adjust for even coverage without over-watering.

## Water Conservation Tips

**Upgrade Your System:** Install smart irrigation controllers that adjust watering based on weather conditions.

**Zone Your Lawn:** Different areas may have different water needs based on sun exposure, slope, and soil type.

**Use Mulch:** Mulch around trees and in garden beds to reduce water evaporation.

**Choose Drought-Tolerant Varieties:** Consider overseeding with more drought-tolerant grass varieties.

## Signs Your Lawn Needs Water

**Early Warning Signs:**
- Grass blades fold or curl
- Footprints remain visible after walking on the lawn
- Grass color changes from bright green to blue-green or gray
- Grass feels crispy or brittle to touch

**Don't Wait for:** Brown patches or completely dormant grass, which indicate severe stress.

## Dealing with Water Restrictions

During drought conditions or water restrictions:

**Prioritize Areas:** Focus water on the most visible or valuable areas of your lawn.

**Raise Mowing Height:** Taller grass shades roots and conserves moisture.

**Reduce Traffic:** Limit foot traffic on stressed areas.

**Accept Some Dormancy:** Cool-season grasses naturally go dormant in extreme heat; they'll recover when conditions improve.

## Common Watering Mistakes

**Over-Watering:** Leads to shallow roots, disease problems, and water waste.

**Under-Watering:** Causes stress, thinning, and weed invasion.

**Inconsistent Watering:** Creates an uneven lawn appearance and stressed areas.

**Watering During Rain:** Wastes water and can lead to over-watering problems.

## Measuring Water Application

Use rain gauges or straight-sided containers placed around your watering area to measure how much water you're applying. This helps ensure even coverage and proper amounts.

Smart summer watering creates a lawn that's not only beautiful but also resilient and environmentally responsible. By understanding your lawn's specific needs and following efficient watering practices, you can maintain a healthy lawn while conserving this precious resource.`,
            category: 'seasonal',
            author: 'Sarah Johnson',
            date: '2024-11-28',
            icon: 'fas fa-tint'
        }
    ];
}

// Make functions globally available
window.openArticle = openArticle;
window.closeArticleModal = closeArticleModal;