// blogSystem.js - 轻量级 Markdown 博客系统

class BlogSystem {
    constructor() {
        this.blogContainer = document.getElementById('blog-container');
        this.postsList = document.querySelector('.posts-list');
        this.postContent = document.querySelector('.post-content');
        this.backBtn = document.querySelector('.back-to-posts');
        this.loadingIndicator = document.querySelector('.loading-indicator');
        
        this.posts = [];
        this.currentPost = null;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        if (!this.blogContainer) {
            console.warn('博客容器未找到');
            return;
        }
        
        this.loadPostsIndex()
            .then(() => {
                this.renderPostsList();
                this.bindEvents();
            })
            .catch(error => {
                console.error('博客系统初始化失败:', error);
                this.showError('博客加载失败，请稍后重试');
            });
    }
    
    async loadPostsIndex() {
        // 模拟从 posts 文件夹加载文章索引
        // 在实际项目中，这里可以通过 API 或配置文件获取文章列表
        this.posts = [
            {
                id: 'post1',
                title: '我的第一篇博客',
                date: '2024-01-15',
                excerpt: '分享我开始写博客的想法和这个网站的制作过程...',
                tags: ['生活', '技术', '前端'],
                readTime: '3 分钟',
                filename: 'post1.md'
            },
            {
                id: 'post2',
                title: 'JavaScript 学习心得',
                date: '2024-02-20',
                excerpt: '从入门到进阶，我在学习 JavaScript 过程中的一些思考和总结...',
                tags: ['JavaScript', '学习', '编程'],
                readTime: '8 分钟',
                filename: 'post2.md'
            },
            {
                id: 'post3',
                title: '旅行的意义',
                date: '2024-03-10',
                excerpt: '记录我在不同城市的见闻和感悟，每一次旅行都是一次心灵的洗礼...',
                tags: ['旅行', '生活', '感悟'],
                readTime: '5 分钟',
                filename: 'post3.md'
            },
            {
                id: 'post4',
                title: '前端开发最佳实践',
                date: '2024-04-05',
                excerpt: '分享一些在前端开发中积累的经验和最佳实践，包括代码规范、性能优化等...',
                tags: ['前端', '开发', '最佳实践'],
                readTime: '10 分钟',
                filename: 'post4.md'
            }
        ];
        
        // 按日期排序（最新的在前）
        this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    renderPostsList() {
        if (!this.postsList) return;
        
        this.postsList.innerHTML = '';
        
        this.posts.forEach((post, index) => {
            const postElement = this.createPostListItem(post, index);
            this.postsList.appendChild(postElement);
        });
        
        // 添加动画效果
        this.animatePostsIn();
    }
    
    createPostListItem(post, index) {
        const article = document.createElement('article');
        article.className = 'post-item';
        article.setAttribute('data-post-id', post.id);
        
        article.innerHTML = `
            <div class="post-meta">
                <span class="post-date">${this.formatDate(post.date)}</span>
                <span class="post-read-time">${post.readTime}</span>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">
                ${post.tags.map(tag => 
                    `<span class="post-tag">${tag}</span>`
                ).join('')}
            </div>
            <div class="post-actions">
                <button class="read-more-btn" data-post-id="${post.id}">
                    阅读全文
                    <span class="btn-arrow">→</span>
                </button>
            </div>
        `;
        
        // 添加延迟动画
        article.style.animationDelay = `${index * 0.1}s`;
        
        return article;
    }
    
    animatePostsIn() {
        const postItems = this.postsList.querySelectorAll('.post-item');
        postItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 100);
        });
    }
    
    bindEvents() {
        // 绑定文章点击事件
        if (this.postsList) {
            this.postsList.addEventListener('click', (e) => {
                const readBtn = e.target.closest('.read-more-btn');
                if (readBtn) {
                    const postId = readBtn.getAttribute('data-post-id');
                    this.loadPost(postId);
                }
            });
        }
        
        // 返回按钮事件
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.showPostsList();
            });
            
            // 键盘支持
            this.backBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showPostsList();
                }
            });
        }
        
        // 键盘导航支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentPost) {
                this.showPostsList();
            }
        });
    }
    
    async loadPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            console.error('文章未找到:', postId);
            return;
        }
        
        this.showLoading(true);
        
        try {
            // 模拟加载 Markdown 文件
            const markdownContent = await this.fetchMarkdownContent(post.filename);
            const htmlContent = await this.parseMarkdown(markdownContent);
            
            this.currentPost = post;
            this.renderPost(post, htmlContent);
            this.showPostContent();
            
        } catch (error) {
            console.error('文章加载失败:', error);
            this.showError('文章加载失败，请稍后重试');
        } finally {
            this.showLoading(false);
        }
    }
    
    async fetchMarkdownContent(filename) {
        // 模拟从 posts 文件夹获取 Markdown 内容
        // 在实际项目中，这里会是真实的文件请求
        const sampleContent = {
            'post1.md': `# 我的第一篇博客

欢迎来到我的个人网站！这是我的第一篇博客文章。

## 为什么要写博客？

写博客对我来说有以下几个意义：

1. **记录成长**：记录学习和工作中的点点滴滴
2. **分享知识**：把学到的东西分享给更多人
3. **思考总结**：通过写作整理思路，加深理解

## 这个网站的技术栈

这个个人网站使用了以下技术：

- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript** - 交互功能
- **Markdown** - 博客内容编写

\`\`\`javascript
// 示例代码：主题切换功能
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
}
\`\`\`

## 未来计划

接下来我计划添加更多功能：

- [ ] 文章搜索功能
- [ ] 评论系统
- [ ] RSS 订阅
- [ ] 更多主题样式

感谢你的阅读！`,

            'post2.md': `# JavaScript 学习心得

作为一名前端开发者，JavaScript 是我们绕不开的核心技能。

## 基础概念的重要性

很多人急于学习框架，但我认为扎实的基础更重要：

### 1. 作用域和闭包

\`\`\`javascript
function createCounter() {
    let count = 0;
    return function() {
        return ++count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

### 2. 异步编程

从回调函数到 Promise，再到 async/await：

\`\`\`javascript
// Promise 方式
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data));

// async/await 方式
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
\`\`\`

## 学习建议

1. **多写代码**：理论再好，不如动手实践
2. **阅读源码**：学习优秀库的实现方式
3. **关注新特性**：JavaScript 在不断演进

> 编程是一门手艺，需要不断练习和打磨。`,

            'post3.md': `# 旅行的意义

旅行教会了我很多课本上学不到的东西。

## 不同的城市，不同的故事

### 北京 - 历史的厚重

在故宫漫步时，仿佛能听到历史的回声。每一块砖瓦都承载着岁月的痕迹。

### 上海 - 现代与传统的交融

外滩的夜景令人震撼，黄浦江两岸的建筑群展现着这座城市的活力与魅力。

### 成都 - 慢生活的哲学

在成都的茶馆里坐一下午，品味生活的另一种可能性。

## 旅行带给我的思考

1. **开阔视野**：看到不同的生活方式
2. **增长见识**：了解各地的文化差异
3. **内心平静**：在路上找到内心的宁静

> 读万卷书，行万里路。旅行是另一种学习方式。

## 旅行贴士

- 提前做好攻略，但要保留灵活性
- 尝试当地美食，体验本土文化
- 记录美好瞬间，但也要用心感受当下

每一次旅行都是一次成长，期待下一次出发！`,

            'post4.md': `# 前端开发最佳实践

经过几年的前端开发经验，我总结了一些最佳实践。

## 代码规范

### 1. 命名规范

\`\`\`javascript
// 好的命名
const userAccountBalance = 1000;
const fetchUserData = () => {};

// 不好的命名
const x = 1000;
const getData = () => {};
\`\`\`

### 2. 函数设计

遵循单一职责原则：

\`\`\`javascript
// 好的设计
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatDate(date) {
    return date.toLocaleDateString('zh-CN');
}

// 不好的设计
function processUserData(userData) {
    // 做了太多事情：验证、格式化、保存等
}
\`\`\`

## 性能优化

### 1. 图片优化

- 使用合适的图片格式
- 实现懒加载
- 提供多种尺寸

### 2. JavaScript 优化

\`\`\`javascript
// 防抖函数
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

// 使用示例
const handleSearch = debounce((searchTerm) => {
    // 执行搜索
}, 300);
\`\`\`

### 3. CSS 优化

- 减少重绘和重排
- 使用 CSS3 硬件加速
- 合理使用选择器

## 用户体验

1. **加载状态**：给用户明确的反馈
2. **错误处理**：友好的错误提示
3. **响应式设计**：适配不同设备

## 工具推荐

- **开发工具**: VS Code, Chrome DevTools
- **构建工具**: Webpack, Vite
- **代码质量**: ESLint, Prettier
- **版本控制**: Git

> 好的代码不仅要能运行，还要易于理解和维护。

持续学习，持续改进！`
        };
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!sampleContent[filename]) {
            throw new Error(`文章文件 ${filename} 不存在`);
        }
        
        return sampleContent[filename];
    }
    
    async parseMarkdown(markdownText) {
        // 检查是否有 marked 库
        if (typeof marked !== 'undefined') {
            // 配置 marked 选项
            marked.setOptions({
                highlight: function(code, lang) {
                    // 简单的代码高亮（可以集成 Prism.js 等库）
                    return `<pre class="language-${lang}"><code>${this.escapeHtml(code)}</code></pre>`;
                },
                breaks: true,
                gfm: true
            });
            
            return marked.parse(markdownText);
        } else {
            // 简单的 Markdown 解析（备用方案）
            return this.simpleMarkdownParse(markdownText);
        }
    }
    
    simpleMarkdownParse(text) {
        // 简单的 Markdown 转 HTML
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/gim, '<code>$1</code>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/^(?!<[h|u|p|b])/gim, '<p>')
            .replace(/$/gim, '</p>');
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    renderPost(post, htmlContent) {
        if (!this.postContent) return;
        
        this.postContent.innerHTML = `
            <article class="post-article">
                <header class="post-header">
                    <div class="post-meta-full">
                        <time class="post-date">${this.formatDate(post.date)}</time>
                        <span class="post-separator">•</span>
                        <span class="post-read-time">${post.readTime}</span>
                        <span class="post-separator">•</span>
                        <span class="post-views">${this.getRandomViews()} 次阅读</span>
                    </div>
                    <h1 class="post-title">${post.title}</h1>
                    <div class="post-tags-full">
                        ${post.tags.map(tag => 
                            `<span class="post-tag-full">#${tag}</span>`
                        ).join('')}
                    </div>
                </header>
                
                <div class="post-body">
                    ${htmlContent}
                </div>
                
                <footer class="post-footer">
                    <div class="post-actions-full">
                        <button class="action-btn like-btn">
                            <span class="action-icon">❤️</span>
                            <span class="action-text">喜欢</span>
                        </button>
                        <button class="action-btn share-btn">
                            <span class="action-icon">📤</span>
                            <span class="action-text">分享</span>
                        </button>
                        <button class="action-btn comment-btn">
                            <span class="action-icon">💬</span>
                            <span class="action-text">评论</span>
                        </button>
                    </div>
                    
                    <div class="post-navigation">
                        ${this.renderPostNavigation(post)}
                    </div>
                </footer>
            </article>
        `;
        
        // 绑定文章内的交互事件
        this.bindPostEvents();
        
        // 代码高亮
        this.highlightCode();
    }
    
    renderPostNavigation(currentPost) {
        const currentIndex = this.posts.findIndex(p => p.id === currentPost.id);
        const prevPost = this.posts[currentIndex + 1];
        const nextPost = this.posts[currentIndex - 1];
        
        let navigation = '<div class="nav-posts">';
        
        if (prevPost) {
            navigation += `
                <div class="nav-post prev-post" data-post-id="${prevPost.id}">
                    <span class="nav-label">上一篇</span>
                    <span class="nav-title">${prevPost.title}</span>
                </div>
            `;
        }
        
        if (nextPost) {
            navigation += `
                <div class="nav-post next-post" data-post-id="${nextPost.id}">
                    <span class="nav-label">下一篇</span>
                    <span class="nav-title">${nextPost.title}</span>
                </div>
            `;
        }
        
        navigation += '</div>';
        return navigation;
    }
    
    bindPostEvents() {
        const postContent = this.postContent;
        if (!postContent) return;
        
        // 文章导航点击事件
        const navPosts = postContent.querySelectorAll('.nav-post');
        navPosts.forEach(nav => {
            nav.addEventListener('click', () => {
                const postId = nav.getAttribute('data-post-id');
                this.loadPost(postId);
            });
        });
        
        // 操作按钮事件
        const likeBtn = postContent.querySelector('.like-btn');
        const shareBtn = postContent.querySelector('.share-btn');
        const commentBtn = postContent.querySelector('.comment-btn');
        
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                likeBtn.classList.toggle('active');
                const icon = likeBtn.querySelector('.action-icon');
                icon.textContent = likeBtn.classList.contains('active') ? '💖' : '❤️';
            });
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.sharePost(this.currentPost);
            });
        }
        
        if (commentBtn) {
            commentBtn.addEventListener('click', () => {
                this.showCommentSection();
            });
        }
    }
    
    highlightCode() {
        // 简单的代码高亮效果
        const codeBlocks = this.postContent.querySelectorAll('pre code, code');
        codeBlocks.forEach(block => {
            block.classList.add('highlighted');
        });
    }
    
    sharePost(post) {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: window.location.href
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showToast('链接已复制到剪贴板');
            });
        }
    }
    
    showCommentSection() {
        this.showToast('评论功能开发中...');
    }
    
    showPostsList() {
        this.blogContainer.classList.remove('show-post');
        this.currentPost = null;
        
        // 滚动到顶部
        this.blogContainer.scrollTop = 0;
    }
    
    showPostContent() {
        this.blogContainer.classList.add('show-post');
        
        // 滚动到顶部
        this.blogContainer.scrollTop = 0;
    }
    
    showLoading(show) {
        this.isLoading = show;
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = show ? 'flex' : 'none';
        }
    }
    
    showError(message) {
        this.showToast(message, 'error');
    }
    
    showToast(message, type = 'info') {
        // 创建 toast 提示
        const toast = document.createElement('div');
        toast.className = `blog-toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => toast.classList.add('show'), 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    getRandomViews() {
        return Math.floor(Math.random() * 1000) + 100;
    }
    
    // 公共方法：搜索文章
    searchPosts(keyword) {
        if (!keyword.trim()) return this.posts;
        
        const searchTerm = keyword.toLowerCase();
        return this.posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // 公共方法：按标签筛选文章
    filterByTag(tag) {
        return this.posts.filter(post => post.tags.includes(tag));
    }
    
    // 公共方法：获取所有标签
    getAllTags() {
        const allTags = this.posts.flatMap(post => post.tags);
        return [...new Set(allTags)];
    }
}

// 博客系统相关的 CSS 样式
const blogSystemCSS = `
    .blog-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .blog-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .blog-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-color, #333);
        margin-bottom: 0.5rem;
    }
    
    .blog-subtitle {
        color: var(--text-secondary, #666);
        font-size: 1.1rem;
    }
    
    .blog-content {
        position: relative;
        min-height: 400px;
    }
    
    .posts-list {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }
    
    .post-item {
        background: var(--bg-color, white);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--border-color, #e0e0e0);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        transform: translateY(20px);
    }
    
    .post-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .post-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }
    
    .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        color: var(--text-secondary, #666);
    }
    
    .post-date {
        background: var(--accent-color, #007bff);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-weight: 500;
    }
    
    .post-read-time {
        color: var(--text-secondary, #666);
    }
    
    .post-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-color, #333);
        margin: 0 0 1rem 0;
        line-height: 1.4;
    }
    
    .post-excerpt {
        color: var(--text-secondary, #666);
        line-height: 1.6;
        margin: 0 0 1.5rem 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }
    
    .post-tag {
        background: var(--bg-secondary, #f5f5f5);
        color: var(--text-color, #333);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        border: 1px solid var(--border-color, #e0e0e0);
        transition: all 0.3s ease;
    }
    
    .post-tag:hover {
        background: var(--accent-color, #007bff);
        color: white;
        border-color: var(--accent-color, #007bff);
    }
    
    .post-actions {
        display: flex;
        justify-content: flex-end;
    }
    
    .read-more-btn {
        background: var(--accent-color, #007bff);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .read-more-btn:hover {
        background: var(--accent-hover, #0056b3);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }
    
    .btn-arrow {
        transition: transform 0.3s ease;
    }
    
    .read-more-btn:hover .btn-arrow {
        transform: translateX(4px);
    }
    
    /* 文章内容样式 */
    .post-content {
        display: none;
        animation: fadeIn 0.3s ease-in-out;
    }
    
    .blog-container.show-post .posts-list {
        display: none;
    }
    
    .blog-container.show-post .post-content {
        display: block;
    }
    
    .back-to-posts {
        background: var(--bg-secondary, #f5f5f5);
        color: var(--text-color, #333);
        border: 1px solid var(--border-color, #e0e0e0);
        padding: 0.5rem 1rem;
        border-radius: 25px;
        cursor: pointer;
        margin-bottom: 2rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .back-to-posts:hover {
        background: var(--accent-color, #007bff);
        color: white;
        border-color: var(--accent-color, #007bff);
    }
    
    .post-article {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .post-header {
        text-align: center;
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
    }
    
    .post-meta-full {
        color: var(--text-secondary, #666);
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }
    
    .post-separator {
        margin: 0 0.5rem;
    }
    
    .post-header .post-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-color, #333);
        margin: 1rem 0;
        line-height: 1.2;
    }
    
    .post-tags-full {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .post-tag-full {
        background: var(--accent-color, #007bff);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .post-body {
        line-height: 1.8;
        color: var(--text-color, #333);
        margin-bottom: 3rem;
    }
    
    .post-body h1, .post-body h2, .post-body h3 {
        color: var(--text-color, #333);
        margin: 2rem 0 1rem 0;
        line-height: 1.3;
    }
    
    .post-body h1 {
        font-size: 2rem;
        border-bottom: 2px solid var(--accent-color, #007bff);
        padding-bottom: 0.5rem;
    }
    
    .post-body h2 {
        font-size: 1.6rem;
    }
    
    .post-body h3 {
        font-size: 1.3rem;
    }
    
    .post-body p {
        margin: 1.5rem 0;
    }
    
    .post-body ul, .post-body ol {
        margin: 1.5rem 0;
        padding-left: 2rem;
    }
    
    .post-body li {
        margin: 0.5rem 0;
    }
    
    .post-body blockquote {
        margin: 2rem 0;
        padding: 1rem 1.5rem;
        background: var(--bg-secondary, #f5f5f5);
        border-left: 4px solid var(--accent-color, #007bff);
        border-radius: 0 8px 8px 0;
        font-style: italic;
        color: var(--text-secondary, #666);
    }
    
    .post-body pre {
        background: var(--bg-secondary, #f5f5f5);
        padding: 1.5rem;
        border-radius: 8px;
        overflow-x: auto;
        margin: 1.5rem 0;
        border: 1px solid var(--border-color, #e0e0e0);
    }
    
    .post-body code {
        background: var(--bg-secondary, #f5f5f5);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-size: 0.9em;
        color: var(--text-color, #333);
        border: 1px solid var(--border-color, #e0e0e0);
    }
    
    .post-body pre code {
        background: none;
        padding: 0;
        border: none;
        color: var(--text-color, #333);
    }
    
    .post-footer {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color, #e0e0e0);
    }
    
    .post-actions-full {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .action-btn {
        background: var(--bg-secondary, #f5f5f5);
        color: var(--text-color, #333);
        border: 1px solid var(--border-color, #e0e0e0);
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .action-btn:hover {
        background: var(--accent-color, #007bff);
        color: white;
        border-color: var(--accent-color, #007bff);
        transform: translateY(-2px);
    }
    
    .action-btn.active {
        background: var(--accent-color, #007bff);
        color: white;
        border-color: var(--accent-color, #007bff);
    }
    
    .post-navigation {
        margin-top: 2rem;
    }
    
    .nav-posts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .nav-post {
        background: var(--bg-secondary, #f5f5f5);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid var(--border-color, #e0e0e0);
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .nav-post:hover {
        background: var(--accent-color, #007bff);
        color: white;
        border-color: var(--accent-color, #007bff);
        transform: translateY(-2px);
    }
    
    .nav-label {
        display: block;
        font-size: 0.8rem;
        color: var(--text-secondary, #666);
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .nav-post:hover .nav-label {
        color: rgba(255, 255, 255, 0.8);
    }
    
    .nav-title {
        display: block;
        font-weight: 600;
        color: var(--text-color, #333);
        line-height: 1.3;
    }
    
    .nav-post:hover .nav-title {
        color: white;
    }
    
    .prev-post {
        text-align: left;
    }
    
    .next-post {
        text-align: right;
    }
    
    /* 加载指示器 */
    .loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    }
    
    [data-theme="dark"] .loading-indicator {
        background: rgba(0, 0, 0, 0.9);
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid var(--border-color, #e0e0e0);
        border-top: 4px solid var(--accent-color, #007bff);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Toast 提示 */
    .blog-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-color, white);
        color: var(--text-color, #333);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border-color, #e0e0e0);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .blog-toast.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .toast-error {
        background: #fee;
        color: #c33;
        border-color: #fcc;
    }
    
    .toast-success {
        background: #efe;
        color: #3c3;
        border-color: #cfc;
    }
    
    /* 动画 */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* 响应式设计 */
    @media (max-width: 768px) {
        .blog-container {
            padding: 1rem;
        }
        
        .blog-title {
            font-size: 2rem;
        }
        
        .posts-list {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        
        .post-item {
            padding: 1.5rem;
        }
        
        .post-header .post-title {
            font-size: 2rem;
        }
        
        .post-body h1 {
            font-size: 1.6rem;
        }
        
        .post-body h2 {
            font-size: 1.4rem;
        }
        
        .post-body h3 {
            font-size: 1.2rem;
        }
        
        .nav-posts {
            grid-template-columns: 1fr;
        }
        
        .post-actions-full {
            flex-direction: column;
            align-items: center;
        }
        
        .action-btn {
            width: 100%;
            justify-content: center;
        }
    }
    
    @media (max-width: 480px) {
        .post-tags, .post-tags-full {
            justify-content: center;
        }
        
        .post-meta {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }
        
        .blog-toast {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        
        .blog-toast.show {
            transform: translateY(0);
        }
    }
`;

// 添加博客样式
function addBlogStyles() {
    const style = document.createElement('style');
    style.textContent = blogSystemCSS;
    document.head.appendChild(style);
}

// 博客工具函数
const BlogUtils = {
    // 估算阅读时间
    calculateReadTime(text) {
        const wordsPerMinute = 250; // 平均阅读速度
        const words = text.trim().split(/\s+/).length;
        const readTime = Math.ceil(words / wordsPerMinute);
        return `${readTime} 分钟`;
    },
    
    // 生成文章摘要
    generateExcerpt(text, length = 150) {
        const plainText = text.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
        return plainText.length > length ? 
            plainText.substring(0, length) + '...' : 
            plainText;
    },
    
    // 获取文章统计信息
    getArticleStats(text) {
        const plainText = text.replace(/<[^>]*>/g, '');
        return {
            characters: plainText.length,
            words: plainText.trim().split(/\s+/).length,
            paragraphs: text.split(/\n\s*\n/).length,
            readTime: this.calculateReadTime(plainText)
        };
    }
};

// 初始化博客系统
document.addEventListener('DOMContentLoaded', function() {
    // 添加博客样式
    addBlogStyles();
    
    // 检查是否有 marked 库
    if (typeof marked === 'undefined') {
        console.warn('建议加载 Marked.js 库以获得更好的 Markdown 解析体验');
    }
    
    // 创建博客系统实例
    window.blogSystem = new BlogSystem();
    
    // 将工具函数添加到全局
    window.BlogUtils = BlogUtils;
    
    console.log('博客系统已初始化');
});

// 导出类和工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogSystem, BlogUtils };
}