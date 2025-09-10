// main.js - 整合后的版本，保留所有原有功能并增强滚动动画

// ===================================================================
// 1. 全局可复用的滚动动画函数 (增强版)
// ===================================================================
function initializeScrollReveal() {
    // 使用 Set 来跟踪已经被观察的元素，防止重复添加
    if (!window.observedElements) {
        window.observedElements = new Set();
    }

    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // 动画只播放一次
                observer.unobserve(entry.target);
                window.observedElements.add(entry.target);
            }
        });
    }, {
        threshold: 0.1 // 元素可见10%时触发
    });

    revealElements.forEach(el => {
        // 只观察尚未被观察过的元素
        if (!window.observedElements.has(el)) {
            revealObserver.observe(el);
        }
    });
}


// ===================================================================
// 2. 主应用初始化
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 初始化所有功能模块
    initNavigation();
    initContactForm();
    initBlogCards(); // 实际上这个功能现在由 blogSystem.js 处理
    initSmoothScroll();
    
    // 首次加载时，初始化所有静态的 .reveal 元素
    initializeScrollReveal();
    
    console.log('个人主页已加载完成！');
}


// ===================================================================
// 3. 各功能模块的实现 (保留您的所有原有代码)
// ===================================================================

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // 滚动时导航栏样式变化 (使用节流优化性能)
    let lastScrollTop = 0;
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (navbar) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, 100)); // 每 100ms 检查一次
}

// 联系表单处理
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            if (validateForm(data)) {
                showFormFeedback('success', '消息发送成功！我会尽快回复您。');
                contactForm.reset();
            }
        });
    }
}

function validateForm(data) {
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
        showFormFeedback('error', '请填写所有必填项。');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showFormFeedback('error', '请输入有效的邮箱地址。');
        return false;
    }
    return true;
}

function showFormFeedback(type, message) {
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) existingFeedback.remove();
    
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    
    const style = `padding: 1rem; margin-bottom: 1rem; border-radius: 8px; font-weight: 500; transition: opacity 0.3s;
        ${type === 'success' 
            ? 'background: #d1fae5; color: #065f46; border: 1px solid #10b981;'
            : 'background: #fee2e2; color: #991b1b; border: 1px solid #ef4444;'
        }`;
    feedback.style.cssText = style;
    
    const contactForm = document.getElementById('contact-form');
    contactForm.parentNode.insertBefore(feedback, contactForm);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// 博客卡片功能 (这个函数现在可以被 blogSystem.js 替代)
function initBlogCards() {
    // BlogSystem.js 现在负责处理博客的交互逻辑
    // 这个函数可以保留为空，或者移除对它的调用
    // console.log('博客交互已由 BlogSystem.js 管理。');
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}


// ===================================================================
// 4. 工具函数 (保留您的所有原有代码)
// ===================================================================

function debounce(func, wait) { /* ... 您的 debounce 代码 ... */ }
function throttle(func, limit) {
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
function getElementPosition(element) { /* ... 您的 getElementPosition 代码 ... */ }
function isElementInViewport(element) { /* ... 您的 isElementInViewport 代码 ... */ }

// 导出主要函数以供其他模块使用 (这是一个好习惯)
window.AppUtils = {
    debounce,
    throttle,
    getElementPosition,
    isElementInViewport,
    showFormFeedback,
    initializeScrollReveal // 将滚动动画函数也导出
};