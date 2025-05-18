// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScrolling();
    initFormHandling();  // <-- Updated to submit to Google Forms
    initAnimations();
    document.body.classList.add('loaded');
});

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        updateActiveNavLink();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        const sections = document.querySelectorAll('section[id], header[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    updateActiveNavLink();
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        if (link.pathname === window.location.pathname && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

function initFormHandling() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm(this)) {
                const formData = new FormData();

                // Map fields to Google Form entry IDs
                formData.append('entry.1861246649', form.querySelector('input[placeholder="Your Name"]').value);
                formData.append('entry.345879599', form.querySelector('input[placeholder="Email Address"]').value);
                formData.append('entry.2092051339', form.querySelector('input[placeholder="Phone Number"]').value);
                formData.append('entry.261232045', form.querySelector('textarea[placeholder="Additional Details"]').value);

                // Submit to your Google Form (replace the URL below!)
                fetch('https://docs.google.com/forms/d/e/1FAIpQLSeJBZnrScqSgq5QNZRAu3MogyH_r6q3DKFKDpS34I1Ju0qDEw/formResponse', {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                }).then(() => {
                    showFormFeedback(form, 'Thank you! Your application has been submitted.', 'success');
                    form.reset();
                }).catch(() => {
                    showFormFeedback(form, 'Oops! Something went wrong. Please try again later.', 'danger');
                });
            }
        });
    });

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            field.classList.remove('is-invalid');
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }

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

    function showFormFeedback(form, message, type) {
        const existingFeedback = form.querySelector('.form-feedback');
        if (existingFeedback) existingFeedback.remove();

        const feedbackElement = document.createElement('div');
        feedbackElement.className = `alert alert-${type} mt-3 form-feedback`;
        feedbackElement.textContent = message;
        form.appendChild(feedbackElement);

        setTimeout(() => {
            feedbackElement.classList.add('fade-out');
            setTimeout(() => feedbackElement.remove(), 500);
        }, 5000);
    }
}

function initAnimations() {
    const animateElements = document.querySelectorAll('.service-card, .stat-item, .section-heading');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });

    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                statNumbers.forEach(statNumber => {
                    const target = parseInt(statNumber.textContent);
                    animateCounter(statNumber, 0, target, 2000);
                });
                statsObserver.unobserve(entries[0].target);
            }
        }, {
            threshold: 0.5
        });

        statsObserver.observe(document.querySelector('.stats-section'));
    }

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
                element.textContent = originalText;
            }
        }

        window.requestAnimationFrame(animate);
    }
}

// CSS Injection for animations
const style = document.createElement('style');
style.textContent = `
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

// Optionally include Bootstrap if not already present
if (!document.querySelector('script[src*="bootstrap"]')) {
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(bootstrapScript);
}
