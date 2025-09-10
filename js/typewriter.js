// typewriter.js - 动态打字机效果

class TypeWriter {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            typeSpeed: 100,        // 打字速度（毫秒）
            deleteSpeed: 50,       // 删除速度（毫秒）
            pauseTime: 2000,       // 每句话之间的停顿时间
            loop: true,            // 是否循环
            showCursor: true,      // 是否显示光标
            cursorChar: '|',       // 光标字符
            ...options
        };
        
        this.texts = options.texts || [];
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        if (!this.element || this.texts.length === 0) {
            console.warn('TypeWriter: 元素或文本数组为空');
            return;
        }
        
        // 设置初始状态
        this.element.textContent = '';
        
        // 开始打字效果
        this.startTyping();
    }
    
    startTyping() {
        this.isTyping = true;
        this.type();
    }
    
    type() {
        const fullText = this.texts[this.currentIndex];
        
        if (this.isDeleting) {
            // 删除字符
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            // 添加字符
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        }
        
        // 更新元素内容
        this.updateElement();
        
        // 计算下一次执行的延迟时间
        let delta = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        
        // 如果完成了一个单词的打字
        if (!this.isDeleting && this.currentText === fullText) {
            delta = this.options.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            // 如果删除完了，切换到下一个文本
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            
            // 如果不循环且已到最后一个，停止
            if (!this.options.loop && this.currentIndex === 0) {
                this.currentIndex = this.texts.length - 1;
                this.currentText = this.texts[this.currentIndex];
                this.updateElement();
                this.isTyping = false;
                return;
            }
            
            delta = this.options.typeSpeed;
        }
        
        // 继续下一次打字
        setTimeout(() => {
            if (this.isTyping) {
                this.type();
            }
        }, delta);
    }
    
    updateElement() {
        if (this.options.showCursor) {
            this.element.innerHTML = this.currentText + '<span class="cursor">' + this.options.cursorChar + '</span>';
        } else {
            this.element.textContent = this.currentText;
        }
    }
    
    // 公共方法：停止打字
    stop() {
        this.isTyping = false;
    }
    
    // 公共方法：重新开始打字
    restart() {
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.startTyping();
    }
    
    // 公共方法：添加新文本
    addText(text) {
        this.texts.push(text);
    }
    
    // 公共方法：设置文本数组
    setTexts(texts) {
        this.texts = texts;
        this.restart();
    }
}

// 简化的打字机效果函数
function createTypeWriter(selector, texts, options = {}) {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    
    if (!element) {
        console.error('TypeWriter: 未找到指定元素');
        return null;
    }
    
    return new TypeWriter(element, { texts, ...options });
}

// 多行打字机效果类
class MultiLineTypeWriter {
    constructor(container, lines, options = {}) {
        this.container = container;
        this.lines = lines;
        this.options = {
            lineDelay: 500,        // 每行之间的延迟
            typeSpeed: 80,         // 打字速度
            showCursor: true,      // 是否显示光标
            ...options
        };
        
        this.currentLine = 0;
        this.typewriters = [];
        
        this.init();
    }
    
    init() {
        if (!this.container || this.lines.length === 0) {
            console.warn('MultiLineTypeWriter: 容器或文本行为空');
            return;
        }
        
        this.createElements();
        this.startTyping();
    }
    
    createElements() {
        // 清空容器
        this.container.innerHTML = '';
        
        // 为每行创建元素
        this.lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'typewriter-line';
            lineElement.style.opacity = '0';
            this.container.appendChild(lineElement);
        });
    }
    
    startTyping() {
        this.typeNextLine();
    }
    
    typeNextLine() {
        if (this.currentLine >= this.lines.length) {
            return;
        }
        
        const lineElement = this.container.children[this.currentLine];
        const text = this.lines[this.currentLine];
        
        // 显示当前行
        lineElement.style.opacity = '1';
        
        // 创建打字机效果
        const typewriter = new TypeWriter(lineElement, {
            texts: [text],
            typeSpeed: this.options.typeSpeed,
            loop: false,
            showCursor: this.currentLine === this.lines.length - 1 // 只在最后一行显示光标
        });
        
        this.typewriters.push(typewriter);
        
        // 延迟后打字下一行
        setTimeout(() => {
            this.currentLine++;
            this.typeNextLine();
        }, text.length * this.options.typeSpeed + this.options.lineDelay);
    }
}

// 初始化首页打字机效果
document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter-text');
    
    if (typewriterElement) {
        // 定义要显示的文本数组
        const heroTexts = [
            '你好，我是 Zhang Yitong',
            '一名探索 AI × 医疗的开发者',
            '专注于 药物协同预测 与 边缘计算',
            '会写代码，也会画画',
            'Slytherin，INTJ，永远在进化'
        ];
        
        // 创建打字机效果
        const heroTypewriter = createTypeWriter(typewriterElement, heroTexts, {
            typeSpeed: 120,
            deleteSpeed: 60,
            pauseTime: 2500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
        
        // 将打字机实例保存到全局，以便其他脚本使用
        window.heroTypewriter = heroTypewriter;
        
        console.log('Hero 打字机效果已初始化');
    }
    
    // 添加打字机相关的 CSS 样式
    addTypewriterStyles();
});

// 添加打字机效果的 CSS 样式
function addTypewriterStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .typewriter-line {
            transition: opacity 0.3s ease-in-out;
        }
        
        .cursor {
            display: inline-block;
            margin-left: 2px;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { 
                opacity: 1; 
            }
            51%, 100% { 
                opacity: 0; 
            }
        }
        
        /* 暂停动画当用户偏好减少运动时 */
        @media (prefers-reduced-motion: reduce) {
            .cursor {
                animation: none;
                opacity: 1;
            }
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
                line-height: 1.2;
            }
        }
        
        @media (max-width: 480px) {
            .hero-title {
                font-size: 2rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// 工具函数：创建简单的打字动画
function animateText(element, text, speed = 100) {
    return new Promise((resolve) => {
        element.textContent = '';
        let i = 0;
        
        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;
            
            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// 工具函数：创建删除文字动画
function eraseText(element, speed = 50) {
    return new Promise((resolve) => {
        const text = element.textContent;
        let i = text.length;
        
        const interval = setInterval(() => {
            element.textContent = text.substring(0, i);
            i--;
            
            if (i < 0) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// 导出类和函数
window.TypeWriter = TypeWriter;
window.MultiLineTypeWriter = MultiLineTypeWriter;
window.createTypeWriter = createTypeWriter;
window.TypewriterUtils = {
    animateText,
    eraseText
};
