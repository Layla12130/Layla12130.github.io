// themeToggle.js - 日夜模式切换功能

class ThemeToggle {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.currentTheme = this.getStoredTheme() || 'light';
        
        this.init();
    }
    
    init() {
        // 设置初始主题
        this.setTheme(this.currentTheme);
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 监听系统主题变化
        this.watchSystemTheme();
    }
    
    bindEvents() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            // 添加键盘支持
            this.themeToggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.storeTheme(newTheme);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        
        // 设置文档主题属性
        document.documentElement.setAttribute('data-theme', theme);
        
        // 更新按钮图标
        this.updateThemeIcon(theme);
        
        // 添加切换动画
        this.addThemeTransition();
        
        // 触发主题变化事件
        this.dispatchThemeChangeEvent(theme);
    }
    
    updateThemeIcon(theme) {
        if (this.themeIcon) {
            // 添加旋转动画
            this.themeIcon.style.transform = 'rotate(180deg)';
            
            setTimeout(() => {
                this.themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
                this.themeIcon.style.transform = 'rotate(0deg)';
            }, 150);
        }
        
        // 更新按钮 aria-label
        if (this.themeToggleBtn) {
            const label = theme === 'light' ? '切换到深色主题' : '切换到浅色主题';
            this.themeToggleBtn.setAttribute('aria-label', label);
        }
    }
    
    addThemeTransition() {
        // 为平滑过渡添加临时类
        document.documentElement.classList.add('theme-transition');
        
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    }
    
    getStoredTheme() {
        // 从 localStorage 获取存储的主题
        try {
            return localStorage.getItem('preferred-theme');
        } catch (e) {
            console.warn('无法访问 localStorage，使用默认主题');
            return null;
        }
    }
    
    storeTheme(theme) {
        // 将主题偏好存储到 localStorage
        try {
            localStorage.setItem('preferred-theme', theme);
        } catch (e) {
            console.warn('无法存储主题偏好到 localStorage');
        }
    }
    
    getSystemTheme() {
        // 检测系统主题偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    watchSystemTheme() {
        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // 只有在用户没有手动设置主题时才跟随系统主题
                if (!this.getStoredTheme()) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(systemTheme);
                }
            });
        }
    }
    
    dispatchThemeChangeEvent(theme) {
        // 触发自定义事件，其他组件可以监听主题变化
        const event = new CustomEvent('themeChange', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);
    }
    
    // 公共方法：获取当前主题
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // 公共方法：检查是否为深色主题
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }
}

// 主题相关的 CSS 过渡动画
const themeTransitionCSS = `
    .theme-transition,
    .theme-transition *,
    .theme-transition *:before,
    .theme-transition *:after {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        transition-delay: 0 !important;
    }
    
    .theme-toggle {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .theme-toggle:hover {
        transform: translateY(-2px) scale(1.05);
    }
    
    .theme-toggle:active {
        transform: translateY(0) scale(0.95);
    }
    
    .theme-icon {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-block;
    }
`;

// 添加主题相关样式
function addThemeStyles() {
    const style = document.createElement('style');
    style.textContent = themeTransitionCSS;
    document.head.appendChild(style);
}

// 主题切换功能的工具函数
const ThemeUtils = {
    // 获取当前主题
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    },
    
    // 检查是否为深色主题
    isDarkTheme() {
        return this.getCurrentTheme() === 'dark';
    },
    
    // 监听主题变化
    onThemeChange(callback) {
        document.addEventListener('themeChange', (e) => {
            callback(e.detail.theme);
        });
    },
    
    // 根据主题获取颜色值
    getThemeColor(colorName) {
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue(`--${colorName}`).trim();
    }
};

// 初始化主题切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 添加主题样式
    addThemeStyles();
    
    // 创建主题切换实例
    window.themeToggle = new ThemeToggle();
    
    // 将工具函数添加到全局
    window.ThemeUtils = ThemeUtils;
    
    console.log('主题切换功能已初始化');
});

// 导出类和工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeToggle, ThemeUtils };
}
