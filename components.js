// Component loader for reusable HTML sections
class ComponentLoader {
    constructor() {
        this.cache = new Map();
    }

    // Load and inject HTML component
    async loadComponent(componentPath, targetSelector) {
        try {
            // Check cache first
            if (this.cache.has(componentPath)) {
                this.injectComponent(this.cache.get(componentPath), targetSelector);
                return;
            }

            // Fetch component HTML
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }

            const html = await response.text();
            
            // Cache the component
            this.cache.set(componentPath, html);
            
            // Inject into DOM
            this.injectComponent(html, targetSelector);

        } catch (error) {
            console.error('Component loading error:', error);
        }
    }

    // Inject HTML into target element
    injectComponent(html, targetSelector) {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.innerHTML = html;
            
            // Trigger custom event for component loaded
            targetElement.dispatchEvent(new CustomEvent('componentLoaded', {
                detail: { selector: targetSelector }
            }));
        } else {
            console.warn(`Target element not found: ${targetSelector}`);
        }
    }

    // Load multiple components
    async loadComponents(components) {
        const promises = components.map(({ path, target }) => 
            this.loadComponent(path, target)
        );
        
        try {
            await Promise.all(promises);
            console.log('All components loaded successfully');
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }
}

// Global component loader instance
window.componentLoader = new ComponentLoader();

// Auto-load components on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a service detail page
    const isServicePage = document.body.classList.contains('service-page') || 
                         document.querySelector('.service-hero');
    
    if (isServicePage) {
        // Load contact section component
        window.componentLoader.loadComponent(
            'components/contact-section.html',
            '#contact-placeholder'
        ).then(() => {
            // Re-initialize contact form functionality
            initializeContactForm();
        });
    }
});

// Initialize contact form after component is loaded
function initializeContactForm() {
    const contactForm = document.querySelector('.service-contact-form');
    
    if (contactForm && !contactForm.hasAttribute('data-initialized')) {
        contactForm.setAttribute('data-initialized', 'true');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
            
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
            
            const email = contactForm.querySelector('input[type="email"]');
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
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '전송 중...';
            submitButton.disabled = true;
            
            // Add loading animation
            submitButton.style.background = 'var(--secondary-color)';
            
            setTimeout(() => {
                showServiceNotification('문의사항이 성공적으로 전송되었습니다! 빠른 시일 내에 연락드리겠습니다.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = 'var(--gradient-primary)';
            }, 2500);
        });
    }
}

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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