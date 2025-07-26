// Service Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Animated counters for service stats
    function animateServiceCounters() {
        const statCards = document.querySelectorAll('.stat-card h3');
        
        statCards.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const isSlash = target.includes('/');
            const isTB = target.includes('TB');
            
            let finalNumber;
            if (isPercentage) {
                finalNumber = parseInt(target.replace('%', ''));
            } else if (isPlus) {
                finalNumber = parseInt(target.replace('+', ''));
            } else if (isSlash) {
                finalNumber = parseInt(target.split('/')[0]);
            } else if (isTB) {
                finalNumber = parseInt(target.replace('TB+', ''));
            } else {
                finalNumber = parseInt(target);
            }
            
            if (isNaN(finalNumber)) return;
            
            let current = 0;
            const increment = finalNumber / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    current = finalNumber;
                    clearInterval(timer);
                }
                
                let displayText = Math.floor(current).toString();
                if (isPercentage) displayText += '%';
                if (isPlus) displayText += '+';
                if (isSlash) displayText = Math.floor(current) + '/7';
                if (isTB) displayText = Math.floor(current) + 'TB+';
                
                counter.textContent = displayText;
            }, 25);
        });
    }

    // Observer for stat cards animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateServiceCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.overview-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollAnimationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply scroll animations to elements
    const animateElements = document.querySelectorAll(
        '.process-step, .portfolio-item, .pricing-card, .feature-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        scrollAnimationObserver.observe(el);
    });

    // Staggered animation for process steps
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.2}s`;
    });

    // Staggered animation for portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });

    // Enhanced service contact form
    const serviceContactForm = document.querySelector('.service-contact-form');
    
    if (serviceContactForm) {
        serviceContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(serviceContactForm);
            const inputs = serviceContactForm.querySelectorAll('input[required], select[required], textarea[required]');
            
            // Validation
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    input.addEventListener('input', function() {
                        this.style.borderColor = 'var(--border-color)';
                    }, { once: true });
                }
            });
            
            const email = serviceContactForm.querySelector('input[type="email"]');
            if (email && !isValidEmail(email.value)) {
                isValid = false;
                email.style.borderColor = '#ef4444';
                showServiceNotification('올바른 이메일 주소를 입력해주세요.', 'error');
                email.addEventListener('input', function() {
                    this.style.borderColor = 'var(--border-color)';
                }, { once: true });
            }
            
            if (!isValid) {
                showServiceNotification('모든 필수 항목을 정확히 입력해주세요.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = serviceContactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '전송 중...';
            submitButton.disabled = true;
            
            // Add loading animation
            submitButton.style.background = 'var(--secondary-color)';
            
            setTimeout(() => {
                showServiceNotification('문의사항이 성공적으로 전송되었습니다! 빠른 시일 내에 연락드리겠습니다.', 'success');
                serviceContactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = 'var(--gradient-primary)';
            }, 2500);
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Service-specific notification system
    function showServiceNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.service-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `service-notification ${type}`;
        
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ'
        };
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type]}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
            min-width: 300px;
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
        `;
        
        const icon = notification.querySelector('.notification-icon');
        icon.style.cssText = `
            font-weight: bold;
            font-size: 1.2rem;
        `;
        
        const message_elem = notification.querySelector('.notification-message');
        message_elem.style.cssText = `
            flex: 1;
            font-weight: 500;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 400);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 400);
            }
        }, 6000);
    }

    // Smooth scroll for pricing buttons
    document.querySelectorAll('.pricing-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Interactive pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('featured') 
                ? 'scale(1.05) translateY(-15px)' 
                : 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('featured') 
                ? 'scale(1.05) translateY(-10px)' 
                : 'translateY(-10px)';
        });
    });

    // Portfolio hover effects
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const placeholder = item.querySelector('.portfolio-placeholder');
        const originalIcon = placeholder.textContent;
        
        item.addEventListener('mouseenter', function() {
            placeholder.style.transform = 'scale(1.2) rotate(10deg)';
            placeholder.style.filter = 'brightness(1.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            placeholder.style.transform = 'scale(1) rotate(0deg)';
            placeholder.style.filter = 'brightness(1)';
        });
    });

    // Dynamic text animation for service hero
    const heroTitle = document.querySelector('.service-hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.style.opacity = '0';
        
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.animation = 'fadeInUp 1s ease-out';
        }, 300);
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .process-step:hover .step-number {
            transform: scale(1.1);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
        }
        
        .portfolio-placeholder {
            transition: all 0.3s ease;
        }
        
        .pricing-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-item:hover .feature-icon {
            transform: scale(1.2);
            background: var(--gradient-primary);
        }
        
        .stat-card:hover {
            transform: translateY(-8px) scale(1.02);
        }
    `;
    document.head.appendChild(style);

    // Auto-scroll to contact form if coming from pricing button
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('scroll') === 'contact') {
        setTimeout(() => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }

    // Service page specific scroll effects
    let lastScrollY = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.pageYOffset;
        
        // Enhanced navbar background
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });

    console.log('Service detail page loaded successfully');
});