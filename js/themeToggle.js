// js/themeToggle.js - 完整的主题切换逻辑，带动画和本地存储

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = themeToggleButton.querySelector('.theme-icon');
    const body = document.body;

    // 1. 获取当前主题（优先从 localStorage 获取，其次是系统偏好）
    const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // 检测系统是否偏好暗色模式
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // 2. 应用主题
    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme); // 保存用户的选择
    };

    // 3. 切换主题并添加动画
    const toggleTheme = () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // 为图标添加动画效果
        themeToggleButton.classList.add('changing');
        
        applyTheme(newTheme);

        // 动画结束后移除 class
        setTimeout(() => {
            themeToggleButton.classList.remove('changing');
        }, 400); // 动画时长
    };

    // 4. 绑定点击事件
    themeToggleButton.addEventListener('click', toggleTheme);

    // 5. 初始加载时应用主题
    applyTheme(getCurrentTheme());
});