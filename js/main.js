document.addEventListener('DOMContentLoaded', () => {
    initNavbarBehavior();
    initScrollAnimations();
    initParallaxEffects();
    initCardAnimations();
    initCoinAnimations();
    initSmoothScroll();
    handleMobileInteractions();
});

// Navbar behavior on scroll
function initNavbarBehavior() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let isNavbarHidden = false;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Show/hide navbar based on scroll direction
        if (currentScroll > lastScroll && !isNavbarHidden && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
            isNavbarHidden = true;
        } else if (currentScroll < lastScroll && isNavbarHidden) {
            navbar.style.transform = 'translateY(0)';
            isNavbarHidden = false;
        }

        // Add/remove background opacity based on scroll position
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        }

        lastScroll = currentScroll;
    });
}

// Scroll animations for sections
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.token-card, .about-card, .section-title').forEach(el => {
        observer.observe(el);
    });
}

// Parallax effects for background images
function initParallaxEffects() {
    const parallaxSections = document.querySelectorAll('.hero, .tokenomics, .about');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking && window.innerWidth > 768) {
            window.requestAnimationFrame(() => {
                parallaxSections.forEach(section => {
                    const distance = window.pageYOffset;
                    const sectionTop = section.offsetTop;
                    const speed = 0.5;
                    
                    // Only apply parallax if section is in view
                    if (distance > sectionTop - window.innerHeight && 
                        distance < sectionTop + section.offsetHeight) {
                        const yPos = (distance - sectionTop) * speed;
                        section.style.backgroundPosition = `center ${yPos}px`;
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Card hover and interaction animations
function initCardAnimations() {
    const cards = document.querySelectorAll('.token-card, .about-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const cardIcon = card.querySelector('i');
            if (cardIcon) {
                cardIcon.style.transform = 'scale(1.2) rotateY(180deg)';
                cardIcon.style.color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-gold').trim();
            }
        });

        card.addEventListener('mouseleave', (e) => {
            const cardIcon = card.querySelector('i');
            if (cardIcon) {
                cardIcon.style.transform = 'scale(1) rotateY(0)';
                cardIcon.style.color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--secondary-gold').trim();
            }
        });
    });
}

// Rotating coin animation in footer
function initCoinAnimations() {
    const footerCoin = document.querySelector('.footer-coin');
    if (!footerCoin) return;

    let isHovered = false;
    let rotationInterval;

    footerCoin.addEventListener('mouseenter', () => {
        isHovered = true;
        clearInterval(rotationInterval);
        
        // Faster rotation on hover
        rotationInterval = setInterval(() => {
            if (!isHovered) return;
            footerCoin.style.transform = `rotateY(${Date.now() / 5 % 360}deg)`;
        }, 16);
    });

    footerCoin.addEventListener('mouseleave', () => {
        isHovered = false;
        clearInterval(rotationInterval);
        
        // Return to normal rotation
        footerCoin.style.transform = '';
    });
}

// Smooth scroll for navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Mobile-specific interactions and optimizations
function handleMobileInteractions() {
    if (window.innerWidth <= 768) {
        // Disable parallax on mobile for better performance
        document.querySelectorAll('.hero, .tokenomics, .about').forEach(section => {
            section.style.backgroundAttachment = 'scroll';
        });

        // Add touch feedback for cards
        document.querySelectorAll('.token-card, .about-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });

            card.addEventListener('touchend', () => {
                card.style.transform = '';
            });
        });
    }
}

// Debounce function for performance optimization
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

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    handleMobileInteractions();
}, 250));