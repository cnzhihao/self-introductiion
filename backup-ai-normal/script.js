// ===== Tech Minimalist Resume Website JavaScript =====

// ===== Utility Functions =====
const utils = {
    // Debounce function for performance optimization
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
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ===== Navigation Controller =====
class NavigationController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupScrollProgress();
    }

    setupScrollEffects() {
        const handleScroll = utils.throttle(() => {
            const scrolled = window.pageYOffset > 50;
            this.navbar.classList.toggle('scrolled', scrolled);
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    setupMobileNavigation() {
        // Toggle mobile menu
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
            
            // Update aria-expanded
            const expanded = this.navMenu.classList.contains('active');
            this.navToggle.setAttribute('aria-expanded', expanded);
        });

        // Close mobile menu when clicking on link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
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
                    const navHeight = this.navbar.offsetHeight;
                    const offsetTop = targetSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Handle scroll-top link
        const scrollTopLink = document.querySelector('.scroll-top');
        if (scrollTopLink) {
            scrollTopLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupActiveNavigation() {
        const handleScroll = utils.throttle(() => {
            const scrollY = window.pageYOffset;
            const navHeight = this.navbar.offsetHeight;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 100;
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
        }, 16);

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
    }

    setupScrollProgress() {
        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        const updateProgress = utils.throttle(() => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = window.pageYOffset / scrollHeight;
            progressBar.style.transform = `scaleX(${Math.min(scrollProgress, 1)})`;
        }, 16);

        window.addEventListener('scroll', updateProgress);
    }
}

// ===== Animation Controller =====
class AnimationController {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupCounterAnimations();
        this.setupSkillBarsAnimation();
        this.setupLoadingAnimations();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    entry.target.classList.add('fade-in-up');
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        const elementsToAnimate = document.querySelectorAll(`
            .timeline-item,
            .project-card,
            .skill-category,
            .community-item,
            .expertise-item,
            .stat-card
        `);

        elementsToAnimate.forEach(el => {
            el.classList.add('loading');
            observer.observe(el);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-target]');
        
        const animateCounter = (counter, target) => {
            const increment = target / 60; // 60 frames for 1 second at 60fps
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
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counter.textContent = '0';
            counterObserver.observe(counter);
        });
    }

    setupSkillBarsAnimation() {
        const skillBars = document.querySelectorAll('.skill-fill');
        
        const animateSkillBar = (bar) => {
            const targetWidth = bar.getAttribute('data-level') + '%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 300); // Delay for better effect
        };

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    animateSkillBar(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }

    setupLoadingAnimations() {
        // Add staggered animation delays
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });

        // Mark all loading elements as loaded when they enter viewport
        const loadingElements = document.querySelectorAll('.loading');
        
        const loadingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('loaded');
                    }, 100 * Array.from(loadingElements).indexOf(entry.target));
                }
            });
        }, { threshold: 0.1 });

        loadingElements.forEach(el => {
            loadingObserver.observe(el);
        });
    }
}

// ===== Form Controller =====
class FormController {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = '此字段为必填项';
        }
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = '请输入有效的邮箱地址';
            }
        }
        // Name validation
        else if (fieldName === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = '姓名至少需要2个字符';
        }
        // Message validation
        else if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = '消息内容至少需要10个字符';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 4px;
            font-weight: 500;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    handleFormSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('请检查并修正表单中的错误', 'error');
            return;
        }

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = '发送中...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showMessage('消息发送成功！我会尽快回复您。', 'success');
            this.form.reset();
            
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Clear any remaining errors
            const errorElements = this.form.querySelectorAll('.field-error');
            errorElements.forEach(el => el.remove());
            
            const errorFields = this.form.querySelectorAll('.error');
            errorFields.forEach(field => field.classList.remove('error'));
            
        }, 1500);
    }

    showMessage(message, type) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.95rem',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            maxWidth: '400px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
}

// ===== Accessibility Controller =====
class AccessibilityController {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
        this.setupAriaLabels();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll(`
            a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])
        `);
        
        interactiveElements.forEach(el => {
            // Add keyboard activation for non-input elements
            if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        el.click();
                    }
                });
            }
        });

        // Focus trap for mobile menu
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll(
                    'a, button, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    setupFocusManagement() {
        // Add focus indicators with better styling
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid var(--accent-blue);
                outline-offset: 2px;
            }
            
            .btn-primary:focus,
            .btn-secondary:focus {
                box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.3);
            }
            
            .nav-link:focus {
                background: rgba(0, 102, 255, 0.1);
                border-radius: 4px;
            }
            
            .form-group input:focus,
            .form-group textarea:focus {
                border-color: var(--accent-blue);
                box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (mediaQuery) => {
            if (mediaQuery.matches) {
                const style = document.createElement('style');
                style.id = 'reduced-motion-styles';
                style.textContent = `
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                `;
                document.head.appendChild(style);
            } else {
                const existingStyle = document.getElementById('reduced-motion-styles');
                if (existingStyle) {
                    existingStyle.remove();
                }
            }
        };
        
        handleMotionPreference(prefersReducedMotion);
        prefersReducedMotion.addEventListener('change', handleMotionPreference);
    }

    setupAriaLabels() {
        // Add comprehensive ARIA labels
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.textContent.trim();
            link.setAttribute('aria-label', `导航到${text}部分`);
        });
        
        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-label', '切换导航菜单');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'nav-menu');
        }
        
        // Form labels
        const formInputs = document.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            const label = input.parentNode.querySelector('label');
            if (label && !input.getAttribute('aria-labelledby')) {
                const labelId = `label-${input.name || Math.random().toString(36).substr(2, 9)}`;
                label.id = labelId;
                input.setAttribute('aria-labelledby', labelId);
            }
        });
        
        // Progress bars
        const skillBars = document.querySelectorAll('.skill-fill');
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            const skillName = bar.closest('.skill-item').querySelector('.skill-name').textContent;
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-valuenow', level);
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
            bar.setAttribute('aria-label', `${skillName} 技能水平: ${level}%`);
        });
    }
}

// ===== Performance Monitor =====
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.monitorPerformance();
    }

    optimizeImages() {
        // Add loading="lazy" to images below the fold
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (index > 2) { // Skip first 3 images (above fold)
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.style.display = 'none';
                console.warn(`Failed to load image: ${img.src}`);
            });
        });
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading
        const lazyElements = document.querySelectorAll('.project-card, .community-item');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, { 
            rootMargin: '50px',
            threshold: 0.1
        });
        
        lazyElements.forEach(el => {
            el.classList.add('loading');
            lazyObserver.observe(el);
        });
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        ];
        
        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let cumulativeScore = 0;
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        cumulativeScore += entry.value;
                    }
                });
                console.log('CLS:', cumulativeScore);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
}

// ===== Error Handler =====
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupUnhandledRejectionHandling();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
            
            // You could send this to an analytics service
            // this.sendToAnalytics('javascript_error', event);
        });
    }

    setupUnhandledRejectionHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            // Prevent the default browser console error
            event.preventDefault();
            
            // You could send this to an analytics service
            // this.sendToAnalytics('unhandled_rejection', event);
        });
    }

    sendToAnalytics(eventType, data) {
        // Example analytics implementation
        // Replace with your preferred analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: eventType,
                fatal: false
            });
        }
    }
}

// ===== Application Initializer =====
class Application {
    constructor() {
        this.components = [];
        this.isInitialized = false;
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

    async bootstrap() {
        try {
            // Initialize error handling first
            this.components.push(new ErrorHandler());
            
            // Initialize core components
            this.components.push(new NavigationController());
            this.components.push(new AnimationController());
            this.components.push(new FormController());
            this.components.push(new AccessibilityController());
            this.components.push(new PerformanceMonitor());
            
            // Mark app as initialized
            this.isInitialized = true;
            document.body.classList.add('app-loaded');
            
            // Log successful initialization
            console.log('✅ 科技简约风格个人网站已成功加载');
            
            // Announce to screen readers
            this.announceToScreenReader('页面已加载完成');
            
        } catch (error) {
            console.error('❌ 应用初始化失败:', error);
            this.handleInitializationError(error);
        }
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    handleInitializationError(error) {
        // Fallback functionality for critical errors
        const fallbackMessage = document.createElement('div');
        fallbackMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
        `;
        fallbackMessage.textContent = '网站加载时遇到问题，请刷新页面重试';
        
        document.body.appendChild(fallbackMessage);
        
        setTimeout(() => {
            if (fallbackMessage.parentNode) {
                fallbackMessage.parentNode.removeChild(fallbackMessage);
            }
        }, 5000);
    }

    destroy() {
        // Cleanup method for SPA navigation
        this.components.forEach(component => {
            if (component.destroy && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        this.components = [];
        this.isInitialized = false;
    }
}

// ===== Global Utilities =====
window.ResumeWebsite = {
    // Smooth scroll utility
    scrollTo: (elementId, offset = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const offsetTop = element.offsetTop - navHeight - offset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    
    // Utility functions
    utils: utils,
    
    // Theme utilities (for potential future theme switching)
    theme: {
        toggle: () => {
            // Future implementation for theme switching
            console.log('Theme switching not implemented yet');
        }
    }
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    new Application();
});

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator && 'production' === 'production') {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('SW registered: ', registration);
        } catch (registrationError) {
            console.log('SW registration failed: ', registrationError);
        }
    });
}

// ===== Export for testing =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NavigationController,
        AnimationController,
        FormController,
        AccessibilityController,
        PerformanceMonitor,
        ErrorHandler,
        Application,
        utils
    };
}