// ===== Particle System ===== 
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
            }
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    drawConnections() {
        this.connections = [];
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // Create gradient for glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, `rgba(0, 255, 136, ${particle.opacity})`);
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== Navigation Handler =====
class NavigationHandler {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.setupScrollEffects();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        const updateNavbar = () => {
            const scrolled = window.pageYOffset > 50;
            this.navbar.classList.toggle('scrolled', scrolled);
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }
    
    setupMobileNavigation() {
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            }
        });
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        const setActiveNav = () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };
        
        window.addEventListener('scroll', setActiveNav);
        setActiveNav(); // Initial call
    }
}

// ===== Animation Controller =====
class AnimationController {
    constructor() {
        this.observers = [];
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupTypewriterEffect();
        this.setupCounterAnimations();
        this.setupSkillBarsAnimation();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation
        const animatedElements = document.querySelectorAll(
            '.timeline-item, .project-card, .skill-category, .community-card'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }
    
    setupTypewriterEffect() {
        const typewriterElement = document.querySelector('.typewriter');
        if (!typewriterElement) return;
        
        const text = typewriterElement.textContent;
        typewriterElement.textContent = '';
        
        let i = 0;
        const typeSpeed = 100;
        
        const typeWriter = () => {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            }
        };
        
        // Start typing after a delay
        setTimeout(typeWriter, 1000);
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-target]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    setupSkillBarsAnimation() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const animateSkillBar = (bar) => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        };
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBar(entry.target);
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }
}

// ===== Form Handler =====
class FormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            this.showMessage('请填写所有必填字段', 'error');
            return;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showMessage('请输入有效的邮箱地址', 'error');
            return;
        }
        
        // Simulate form submission
        this.showMessage('消息发送成功！我会尽快回复您。', 'success');
        this.form.reset();
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#00ff88' : '#ff4757'
        });
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            messageEl.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
}

// ===== Scroll Progress Indicator =====
class ScrollProgressIndicator {
    constructor() {
        this.createIndicator();
        this.setupScrollListener();
    }
    
    createIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.className = 'scroll-indicator';
        document.body.appendChild(this.indicator);
    }
    
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = window.pageYOffset / scrollHeight;
            this.indicator.style.transform = `scaleX(${scrollProgress})`;
        });
    }
}

// ===== Performance Optimization =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.setupLazyLoading();
        this.preloadCriticalResources();
    }
    
    optimizeImages() {
        // Add loading="lazy" to images below the fold
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (index > 2) { // Skip first 3 images (above fold)
                img.loading = 'lazy';
            }
        });
    }
    
    setupLazyLoading() {
        // Lazy load non-critical animations
        const lazyElements = document.querySelectorAll('.project-card, .community-card');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '50px' });
        
        lazyElements.forEach(el => {
            el.classList.add('loading');
            lazyObserver.observe(el);
        });
    }
    
    preloadCriticalResources() {
        // Preload critical fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];
        
        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// ===== Accessibility Enhancements =====
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
        this.setupReducedMotion();
    }
    
    setupKeyboardNavigation() {
        // Enable keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]'
        );
        
        interactiveElements.forEach(el => {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
                    el.click();
                }
            });
        });
    }
    
    setupFocusManagement() {
        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid var(--accent-green);
                outline-offset: 2px;
            }
            
            .nav-link:focus,
            .cta-button:focus,
            .social-link:focus {
                box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.5);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupAriaLabels() {
        // Add aria-labels to navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.textContent.trim();
            link.setAttribute('aria-label', `导航到${text}部分`);
        });
        
        // Add aria-label to mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-label', '切换移动端菜单');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== Error Handler =====
class ErrorHandler {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            // Could send to analytics service
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            // Could send to analytics service
        });
    }
}

// ===== Application Initializer =====
class App {
    constructor() {
        this.components = [];
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bootstrap());
        } else {
            this.bootstrap();
        }
    }
    
    bootstrap() {
        try {
            // Initialize core components
            this.components.push(new ErrorHandler());
            this.components.push(new ParticleSystem());
            this.components.push(new NavigationHandler());
            this.components.push(new AnimationController());
            this.components.push(new FormHandler());
            this.components.push(new ScrollProgressIndicator());
            this.components.push(new PerformanceOptimizer());
            this.components.push(new AccessibilityEnhancer());
            
            // Mark app as loaded
            document.body.classList.add('app-loaded');
            
            console.log('🚀 AI产品专家个人网站已成功加载');
            
        } catch (error) {
            console.error('App initialization failed:', error);
        }
    }
    
    destroy() {
        // Cleanup method for single-page apps
        this.components.forEach(component => {
            if (component.destroy && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
    }
}

// ===== Initialize Application =====
new App();

// ===== Global Utilities =====
window.AppUtils = {
    // Smooth scroll to element
    scrollToElement: (elementId, offset = 70) => {
        const element = document.getElementById(elementId);
        if (element) {
            const offsetTop = element.offsetTop - offset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ===== Service Worker Registration (for PWA support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if service worker file exists
        fetch('/sw.js')
            .then(() => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            })
            .catch(() => {
                // Service worker file doesn't exist, skip registration
            });
    });
}