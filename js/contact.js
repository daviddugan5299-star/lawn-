// GreenSpace Contact Page JavaScript

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeContactForm();
    initializeFAQ();
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
}

function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('border-red-500');
            field.classList.remove('border-gray-300');
        } else {
            field.classList.remove('border-red-500');
            field.classList.add('border-gray-300');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        document.getElementById('email').classList.add('border-red-500');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (in a real application, this would be an API call)
    setTimeout(() => {
        // Success response
        showNotification('Thank you for your message! We\'ll respond within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Send confirmation email simulation
        sendConfirmationEmail(formData.get('email'), formData.get('firstName'));
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // If newsletter was checked, add to newsletter
        if (formData.get('newsletter')) {
            setTimeout(() => {
                showNotification('You\'ve been subscribed to our newsletter!', 'info');
            }, 2000);
        }
        
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendConfirmationEmail(email, firstName) {
    // In a real application, this would trigger an email service
    console.log(`Sending confirmation email to ${email} for ${firstName}`);
    
    // Show confirmation that email was sent
    setTimeout(() => {
        showNotification(`Confirmation email sent to ${email}`, 'info');
    }, 3000);
}

// FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

function toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = questionElement.querySelector('i');
    
    // Close all other FAQ items
    const allFAQItems = document.querySelectorAll('.faq-item');
    allFAQItems.forEach(item => {
        if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-question i');
            otherAnswer.classList.add('hidden');
            otherIcon.classList.remove('rotate-180');
        }
    });
    
    // Toggle current FAQ item
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
    } else {
        answer.classList.add('hidden');
        icon.classList.remove('rotate-180');
    }
}

// Live chat functionality (simulation)
function openLiveChat() {
    // In a real application, this would open a live chat widget
    showNotification('Live chat is currently offline. Please use our contact form or call us directly.', 'info');
    
    // Simulate checking for available agents
    setTimeout(() => {
        if (confirm('Would you like us to call you back within the next hour?')) {
            const phone = prompt('Please enter your phone number:');
            if (phone) {
                showNotification(`Thank you! We'll call you at ${phone} within the hour.`, 'success');
            }
        }
    }, 1500);
}

// Form field enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Auto-format phone number
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
    
    // Subject-based form customization
    const subjectField = document.getElementById('subject');
    if (subjectField) {
        subjectField.addEventListener('change', function() {
            customizeFormBasedOnSubject(this.value);
        });
    }
    
    // Add character count to message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const charCount = document.createElement('div');
        charCount.className = 'text-xs text-gray-500 mt-1 text-right';
        charCount.id = 'charCount';
        messageField.parentNode.appendChild(charCount);
        
        messageField.addEventListener('input', function() {
            const count = this.value.length;
            const maxCount = 1000;
            charCount.textContent = `${count}/${maxCount} characters`;
            
            if (count > maxCount * 0.9) {
                charCount.classList.add('text-orange-500');
            } else {
                charCount.classList.remove('text-orange-500');
            }
        });
    }
});

function customizeFormBasedOnSubject(subject) {
    const messageField = document.getElementById('message');
    const propertySizeField = document.getElementById('propertySize');
    
    // Update placeholder and suggestions based on subject
    switch (subject) {
        case 'product-inquiry':
            messageField.placeholder = 'Please tell us which products you\'re interested in and any specific questions you have...';
            break;
        case 'lawn-care-advice':
            messageField.placeholder = 'Describe your lawn\'s current condition, any issues you\'re experiencing, and your goals...';
            propertySizeField.parentNode.style.display = 'block';
            break;
        case 'service-request':
            messageField.placeholder = 'Describe the services you need, your timeline, and property details...';
            propertySizeField.parentNode.style.display = 'block';
            break;
        case 'order-support':
            messageField.placeholder = 'Please provide your order number and describe the issue you\'re experiencing...';
            break;
        case 'partnership':
            messageField.placeholder = 'Tell us about your business and the type of partnership you\'re interested in...';
            break;
        default:
            messageField.placeholder = 'Tell us about your lawn care needs, questions, or how we can help you...';
    }
}

// Form validation helpers
function validateForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Auto-save form data to prevent loss
let formData = {};
let autoSaveInterval;

function initializeAutoSave() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Load saved data
    const savedData = localStorage.getItem('greenspace_contact_form');
    if (savedData) {
        formData = JSON.parse(savedData);
        populateFormFromSavedData();
    }
    
    // Save data on input
    form.addEventListener('input', function(e) {
        formData[e.target.name] = e.target.value;
        localStorage.setItem('greenspace_contact_form', JSON.stringify(formData));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem('greenspace_contact_form');
    });
}

function populateFormFromSavedData() {
    Object.keys(formData).forEach(key => {
        const field = document.getElementById(key);
        if (field && formData[key]) {
            field.value = formData[key];
        }
    });
    
    // Show notification about restored data
    if (Object.keys(formData).length > 0) {
        showNotification('Previous form data has been restored.', 'info');
    }
}

// Initialize auto-save when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoSave();
});

// Service area functionality
function checkServiceArea() {
    const zipCode = prompt('Enter your ZIP code to check if we service your area:');
    
    if (zipCode) {
        // Simulate service area check
        const serviceZips = ['12345', '12346', '12347', '12348', '12349', '12350'];
        const isInServiceArea = serviceZips.includes(zipCode.trim());
        
        if (isInServiceArea) {
            showNotification(`Great! We provide full service to ${zipCode}. Free delivery available!`, 'success');
        } else {
            showNotification(`We don't currently service ${zipCode}, but we do ship products nationwide. Contact us for shipping rates.`, 'info');
        }
    }
}

// Emergency contact handling
function handleEmergencyContact() {
    const isEmergency = confirm('Is this a true lawn care emergency requiring immediate attention?');
    
    if (isEmergency) {
        const customerType = confirm('Are you an existing service customer? Click OK for Yes, Cancel for No.');
        
        if (customerType) {
            // Existing customer - provide emergency number
            alert('Emergency Line: (555) 123-4567\n\nOur emergency service team will respond within 2 hours for existing customers.');
            window.open('tel:+15551234567');
        } else {
            // New customer - provide options
            alert('For new customers, please:\n\n1. Call our main line at (555) 123-4567 during business hours\n2. Use our contact form for non-urgent issues\n3. Email us at info@greenspacelawn.com\n\nWe\'ll prioritize your request and respond as quickly as possible.');
        }
    }
}

// Make functions globally available
window.toggleFAQ = toggleFAQ;
window.openLiveChat = openLiveChat;
window.checkServiceArea = checkServiceArea;
window.handleEmergencyContact = handleEmergencyContact;