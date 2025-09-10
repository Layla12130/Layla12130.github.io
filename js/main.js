// main.js - 入口文件，统一加载功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能模块
    initializeApp();
});

function initializeApp() {
    // 初始化导航栏
    initNavigation();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化表单处理
    initContactForm();
    
    // 初始化博客功能
    initBlogCards();
    
    // 平滑滚动
    initSmoothScroll();
    
    console.log('个人主页已加载完成！');
}

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 移动端导航切换
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 点击导航链接关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // 滚动时导航栏样式变化
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 滚动动画初始化
function initScrollAnimations() {
    // 创建 Intersection Observer 用于触发动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.project-card, .hobby-card, .blog-card, .timeline-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // 添加渐入动画的CSS类
    const style = document.createElement('style');
    style.textContent = `
        .project-card, .hobby-card, .blog-card, .timeline-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .project-card.animate, .hobby-card.animate, .blog-card.animate, .timeline-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// 联系表单处理
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // 表单验证
            if (validateForm(data)) {
                // 这里可以添加实际的表单提交逻辑
                showFormFeedback('success', '消息发送成功！我会尽快回复您。');
                contactForm.reset();
            }
        });
    }
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('请填写姓名');
    }
    
    if (!data.email.trim()) {
        errors.push('请填写邮箱');
    } else if (!isValidEmail(data.email)) {
        errors.push('请填写有效的邮箱地址');
    }
    
    if (!data.subject) {
        errors.push('请选择主题');
    }
    
    if (!data.message.trim()) {
        errors.push('请填写留言内容');
    }
    
    if (errors.length > 0) {
        showFormFeedback('error', errors.join('\n'));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormFeedback(type, message) {
    // 移除现有的反馈消息
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // 创建新的反馈消息
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    
    // 添加样式
    const style = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 8px;
        font-weight: 500;
        ${type === 'success' 
            ? 'background: #d1fae5; color: #065f46; border: 1px solid #10b981;'
            : 'background: #fee2e2; color: #991b1b; border: 1px solid #ef4444;'
        }
    `;
    feedback.style.cssText = style;
    
    // 插入到表单前面
    const contactForm = document.getElementById('contact-form');
    contactForm.parentNode.insertBefore(feedback, contactForm);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 3000);
}

// 博客卡片功能
function initBlogCards() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('click', function() {
            const postId = card.dataset.post;
            // 这里可以添加博客文章展开逻辑
            console.log(`打开博客文章 ${postId}`);
        });
    });
}

// 平滑滚动
function initSmoothScroll() {
    // 处理锚点链接的平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 工具函数：防抖
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

// 工具函数：节流
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// 获取元素在页面中的位置
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height
    };
}

// 检查元素是否在视口中
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 导出主要函数以供其他模块使用
window.AppUtils = {
    debounce,
    throttle,
    getElementPosition,
    isElementInViewport,
    showFormFeedback
};
