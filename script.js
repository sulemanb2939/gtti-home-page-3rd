// ===== NAVIGATION =====
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Active navigation link
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Close mobile menu
        navMenu.classList.remove('active');
        
        // Smooth scroll to section
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - header.offsetHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== ANIMATED COUNTERS =====
const counters = document.querySelectorAll('.stat-number');
let counterAnimated = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
};

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.reveal-on-scroll');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('revealed');
        }
    });
};

// ===== HERO ANIMATIONS =====
const heroText = document.querySelector('.hero-text');
const heroImage = document.querySelector('.hero-image');

window.addEventListener('load', () => {
    // Trigger hero animations
    if (heroText) {
        heroText.classList.add('fade-in-left');
    }
    if (heroImage) {
        heroImage.classList.add('fade-in-right');
    }
    
    // Trigger counter animation when hero is visible
    setTimeout(() => {
        if (!counterAnimated) {
            animateCounters();
            counterAnimated = true;
        }
    }, 500);
});

// ===== PORTAL BUTTONS =====
const portalButtons = document.querySelectorAll('.portal-btn');

portalButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const portalType = this.textContent.toLowerCase();
        
        // Ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Show alert (in production, this would navigate to actual portal)
        setTimeout(() => {
            alert(`Redirecting to ${this.textContent}...\n\nIn production, this would navigate to the actual portal login page.`);
        }, 300);
    });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .portal-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== SCROLL EVENT LISTENERS =====
window.addEventListener('scroll', () => {
    revealOnScroll();
    
    // Parallax effect for floating cards
    const scrolled = window.pageYOffset;
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrolled * speed);
        card.style.transform = `translateY(${yPos}px)`;
    });
});

// ===== ANNOUNCEMENT LINKS =====
const announcementLinks = document.querySelectorAll('.announcement-link');

announcementLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const announcementTitle = this.closest('.announcement-card').querySelector('.announcement-title').textContent;
        alert(`Opening: ${announcementTitle}\n\nIn production, this would open the full announcement details.`);
    });
});

// ===== SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== INTERSECTION OBSERVER FOR BETTER PERFORMANCE =====
if ('IntersectionObserver' in window) {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate counters when hero section is visible
                if (entry.target.classList.contains('hero') && !counterAnimated) {
                    setTimeout(() => {
                        animateCounters();
                        counterAnimated = true;
                    }, 500);
                }
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    revealElements.forEach(element => {
        observer.observe(element);
    });
    
    // Observe hero section for counter animation
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
} else {
    // Fallback for browsers without IntersectionObserver
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// ===== INITIAL PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Initial reveal check
    revealOnScroll();
    
    // Add loaded class to body for any CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Keyboard navigation for portal cards
const portalCards = document.querySelectorAll('.portal-card');

portalCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const button = this.querySelector('.portal-btn');
            if (button) {
                button.click();
            }
        }
    });
});

// Feature cards keyboard navigation
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.setAttribute('tabindex', '0');
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%cGTTI Digital Learning Hub', 'color: #1e5631; font-size: 24px; font-weight: bold;');
console.log('%cGovernment Technical Training Institute', 'color: #1e3a5f; font-size: 14px;');
console.log('%cEmpowering Technical Education Through Digital Innovation', 'color: #666666; font-size: 12px; font-style: italic;');
