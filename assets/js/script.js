import { formHandler } from './formHandler'

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    formHandler();
    // Initialize all components
    initNavbar();
    initSmoothScrolling();
    initFormHandling();
    initAnimations();
    
    // Fade in the page
    document.body.classList.add('loaded');
});

/**
 * Navbar functionality - handles scroll effects and mobile menu
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Change navbar style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        // Get all sections that have an ID defined
        const sections = document.querySelectorAll('section[id], header[id]');
        
        // Check which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Initialize active nav link on page load
    updateActiveNavLink();
}

/**
 * Smooth scrolling functionality for navigation links
 */
function initSmoothScrolling() {
    // Select all links with hashes
    document.querySelectorAll('a[href*="#"]')
        .forEach(link => {
            // Only handle links that point to an id on this page
            if (link.pathname === window.location.pathname && 
                link.getAttribute('href').startsWith('#')) {
                
                link.addEventListener('click', function(e) {
                    // Prevent default anchor click behavior
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Calculate offset with navbar height consideration
                        const navbarHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = targetElement.offsetTop - navbarHeight;
                        
                        // Smooth scroll to target
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        });
}

/**
 * Form handling for validation and submission
 */
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            if (validateForm(this)) {
                // Show success message - in real app would submit to server
                showFormFeedback(this, 'Thank you! Your message has been received.', 'success');
                this.reset();
            }
        });
    });
    
    // Simple form validation helper
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            // Remove existing error styling
            field.classList.remove('is-invalid');
            
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }
            
            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value.trim())) {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    // Form feedback message
    function showFormFeedback(form, message, type) {
        // Remove any existing feedback
        const existingFeedback = form.querySelector('.form-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Create feedback element
        const feedbackElement = document.createElement('div');
        feedbackElement.className = `alert alert-${type} mt-3 form-feedback`;
        feedbackElement.textContent = message;
        
        // Add to form
        form.appendChild(feedbackElement);
        
        // Remove feedback after 5 seconds
        setTimeout(() => {
            feedbackElement.classList.add('fade-out');
            setTimeout(() => feedbackElement.remove(), 500);
        }, 5000);
    }
}

/**
 * Animation effects for page elements
 */
function initAnimations() {
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.service-card, .stat-item, .section-heading');
    
    // Setup Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // slight offset to trigger earlier
    });
    
    // Start observing elements
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Only setup counter if stats section exists and IntersectionObserver is supported
    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                statNumbers.forEach(statNumber => {
                    const target = parseInt(statNumber.textContent);
                    animateCounter(statNumber, 0, target, 2000);
                });
                statsObserver.unobserve(entries[0].target); // Only animate once
            }
        }, {
            threshold: 0.5 // Trigger when stats section is 50% visible
        });
        
        // Start observing the stats section
        statsObserver.observe(document.querySelector('.stats-section'));
    }
    
    // Counter animation helper function
    function animateCounter(element, start, end, duration) {
        let startTime = null;
        const originalText = element.textContent;
        const hasPlus = originalText.includes('+');
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = hasPlus ? `${value}+` : value;
            
            if (progress < 1) {
                window.requestAnimationFrame(animate);
            } else {
                element.textContent = originalText; // Ensure final text is exactly as original
            }
        }
        
        window.requestAnimationFrame(animate);
    }
}

// Add additional CSS for animations
const style = document.createElement('style');
style.textContent = `
    /* Animation styles */
    .service-card, .stat-item, .section-heading {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .service-card.animated, .stat-item.animated, .section-heading.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .fade-out {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(style);

// Add Bootstrap JS at the end (if needed but not already included in HTML)
if (!document.querySelector('script[src*="bootstrap"]')) {
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(bootstrapScript);
}

