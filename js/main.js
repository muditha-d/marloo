// Main JavaScript for Marloo Solutions Website
document.addEventListener('DOMContentLoaded', function() {
    // Cultural Sensitivity Modal
    initModal();
    
    // Mobile Menu
    initMobileMenu();
    
    // Smooth Scrolling
    initSmoothScrolling();
    
    // Form Handling
    initForms();
    
    // Animation on Scroll
    initScrollAnimations();
    
    // Initialize additional features
    initSearch();
    initLazyLoading();
});

function toggleMenu() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('open');
}
// Modal Functionality
function initModal() {
    const modal = document.getElementById('culturalModal');
    const continueBtn = document.getElementById('continueBtn');
    
    if (modal && continueBtn) {
        // Check if modal was already seen in this session
        if (sessionStorage.getItem('culturalModalSeen') === 'true') {
            modal.classList.add('hidden');
            return;
        }
        
        // Show modal on page load (remove hidden class)
        setTimeout(() => {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }, 500); // Small delay for better UX
        
        // Close modal when continue button is clicked
        continueBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
            sessionStorage.setItem('culturalModalSeen', 'true');
            
            // Completely hide after animation
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        // Close modal when clicking outside of it
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
                sessionStorage.setItem('culturalModalSeen', 'true');
                
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                sessionStorage.setItem('culturalModalSeen', 'true');
                
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Reset hamburger menu
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Reset hamburger menu
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Handling
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalidField = null;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                    field.classList.add('error');
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    field.style.borderColor = '#27ae60';
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !isValidEmail(field.value)) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                    field.classList.add('error');
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                }
            });
            
            if (isValid) {
                showLoading();
                
                // Simulate form submission
                setTimeout(() => {
                    hideLoading();
                    showNotification('Thank you for your message. We\'ll get back to you soon!', 'success');
                    form.reset();
                    
                    // Reset field styles
                    requiredFields.forEach(field => {
                        field.style.borderColor = '';
                        field.classList.remove('error');
                    });
                }, 2000);
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                    this.classList.add('error');
                } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                    this.style.borderColor = '#e74c3c';
                    this.classList.add('error');
                } else {
                    this.style.borderColor = '#27ae60';
                    this.classList.remove('error');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    if (this.type === 'email') {
                        if (isValidEmail(this.value)) {
                            this.style.borderColor = '#27ae60';
                            this.classList.remove('error');
                        }
                    } else if (this.value.trim()) {
                        this.style.borderColor = '#27ae60';
                        this.classList.remove('error');
                    }
                }
            });
        });
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f39c12';
            break;
        default:
            notification.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close on click
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for grid items
                if (entry.target.parentElement.classList.contains('services-grid') ||
                    entry.target.parentElement.classList.contains('stats')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                // Counter animation for stats
                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animatedElements = document.querySelectorAll('.card, .service-card, .stat, .testimonial');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Counter Animation for Stats
function animateCounter(statElement) {
    const numberElement = statElement.querySelector('h3');
    if (!numberElement) return;
    
    const finalNumber = numberElement.textContent.replace(/[^\d]/g, '');
    if (!finalNumber) return;
    
    const target = parseInt(finalNumber);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const suffix = numberElement.textContent.replace(/[\d]/g, '');
        numberElement.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('#search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const searchableElements = document.querySelectorAll('.searchable');
            
            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes(searchTerm) || searchTerm === '') {
                    element.style.display = '';
                    element.style.opacity = '1';
                } else {
                    element.style.display = 'none';
                    element.style.opacity = '0';
                }
            });
            
            // Show "no results" message if needed
            const visibleResults = document.querySelectorAll('.searchable:not([style*="display: none"])');
            if (visibleResults.length === 0 && searchTerm !== '') {
                showNotification('No results found for your search.', 'info');
            }
        }, 300));
    }
}

// Loading Animation
function showLoading() {
    // Remove existing loader
    const existingLoader = document.getElementById('loader');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #d4a574;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
    `;
    
    // Add spin animation if not already present
    if (!document.querySelector('#spin-animation')) {
        const style = document.createElement('style');
        style.id = 'spin-animation';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}

// Image Lazy Loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                    
                    // Fade in effect
                    img.style.opacity = '0';
                    img.onload = () => {
                        img.style.transition = 'opacity 0.3s ease';
                        img.style.opacity = '1';
                    };
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
            img.style.opacity = '0';
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 10));
}

// Initialize header scroll effect
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
});

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #d4a574;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
});

function createAdditionalRings() {
    const container = document.querySelector('.logo-protection-container');
    const colors = [
        'rgba(255, 255, 255, 0.6)', // White - Spirit
        'rgba(255, 212, 0, 0.6)',   // Yellow - Energy  
        'rgba(255, 68, 68, 0.6)',   // Red - Land Spirit
        'rgba(0, 0, 0, 0.5)',       // Black - Strength
        'rgba(255, 255, 255, 0.4)', // White - Spirit (repeat)
        'rgba(255, 212, 0, 0.4)',   // Yellow - Energy (repeat)
        'rgba(255, 68, 68, 0.4)',   // Red - Land Spirit (repeat)
        'rgba(0, 0, 0, 0.3)'        // Black - Strength (repeat)
    ];
    
    colors.forEach((color, index) => {
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${110 + (index * 10)}%;
            height: ${110 + (index * 10)}%;
            transform: translate(-50%, -50%);
            border: 2px solid ${color};
            border-radius: 50%;
            animation: expandingRing ${4 + (index * 0.5)}s infinite ease-out;
            animation-delay: ${index * 0.3}s;
            z-index: ${-index};
            pointer-events: none;
        `;
        container.appendChild(ring);
    });
}

// Call this function after the page loads
window.addEventListener('load', createAdditionalRings);
