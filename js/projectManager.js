// js/projectManager.js - 动态项目展示与筛选系统

// ===================================================================
// 1. 配置
// ===================================================================
const GITHUB_USERNAME = "Layla12130"; // <--- 在这里替换成你的 GitHub 用户名!

// ===================================================================
// 2. ProjectCard 类 (面向对象组件)
// ===================================================================
class ProjectCard {
    constructor(project) {
        this.name = project.name.replace(/[-_]/g, ' ');
        this.url = project.html_url;
        this.description = project.description || '暂无描述。';
        this.language = project.language;
        this.stars = project.stargazers_count;
    }

    render() {
        const languageTag = this.language ? `<span class="tag">${this.language}</span>` : '';
        // 注意：为卡片添加 .reveal 类
        return `
            <div class="project-card reveal">
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-title">${this.name}</h3>
                        <div class="project-stars">⭐ ${this.stars}</div>
                    </div>
                    <p class="project-description">${this.description}</p>
                    <div class="project-tags">${languageTag}</div>
                    <div class="project-links">
                        <a href="${this.url}" target="_blank" rel="noopener noreferrer" class="btn btn-small">
                            在 GitHub 上查看
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}


// ===================================================================
// 3. ProjectManager 类 (主控制器)
// ===================================================================
class ProjectManager {
    constructor(username) {
        this.username = username;
        this.projects = [];
        this.gridContainer = document.getElementById('projects-grid');
        this.filtersContainer = document.getElementById('project-filters');

        if (!this.gridContainer || !this.filtersContainer) return;
        this.init();
    }

    async init() {
        this.showLoadingState();
        try {
            await this.fetchProjects();
            this.createFilterButtons();
            this.renderProjects(this.projects);
            this.setupEventListeners();
        } catch (error) {
            this.showErrorState(error);
        }
    }

    async fetchProjects() {
        const apiUrl = `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`GitHub API 请求失败: ${response.status}`);
            const data = await response.json();
            this.projects = data
                .filter(repo => !repo.fork)
                .sort((a, b) => b.stargazers_count - a.stargazers_count);
        } catch (error) {
            console.error("获取 GitHub 项目失败:", error);
            throw error;
        }
    }

    renderProjects(projectsToRender) {
        if (projectsToRender.length === 0) {
            this.gridContainer.innerHTML = `<p class="section-subtitle">没有找到相关项目。</p>`;
            return;
        }
        
        const projectsHTML = projectsToRender
            .map(project => new ProjectCard(project).render())
            .join('');
        
        this.gridContainer.innerHTML = projectsHTML;
        
        // ============================================================
        // 关键修复：在动态内容添加到 DOM 后，重新初始化滚动动画
        // ============================================================
        if (typeof initializeScrollReveal === 'function') {
            initializeScrollReveal();
        }
    }

    createFilterButtons() {
        const languages = new Set(this.projects.map(p => p.language).filter(Boolean));
        const buttonsHTML = ['All', ...languages]
            .map(lang => `<button class="filter-btn ${lang === 'All' ? 'active' : ''}" data-lang="${lang}">${lang}</button>`)
            .join('');
        this.filtersContainer.innerHTML = buttonsHTML;
    }

    setupEventListeners() {
        this.filtersContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-btn')) {
                const language = event.target.dataset.lang;
                this.handleFilter(language, event.target);
            }
        });
    }

    handleFilter(language, clickedButton) {
        this.filtersContainer.querySelector('.active').classList.remove('active');
        clickedButton.classList.add('active');

        const filteredProjects = (language === 'All')
            ? this.projects
            : this.projects.filter(project => project.language === language);

        Array.from(this.gridContainer.children).forEach(card => card.classList.add('hide'));
        setTimeout(() => this.renderProjects(filteredProjects), 300);
    }

    showLoadingState() {
        this.gridContainer.innerHTML = `<p class="section-subtitle">正在从 GitHub 加载项目...</p>`;
    }

    showErrorState(error) {
        this.gridContainer.innerHTML = `<p class="section-subtitle error">抱歉，项目加载失败。<br><small>${error.message}</small></p>`;
    }
}

// 启动项目管理器
document.addEventListener('DOMContentLoaded', () => {
    if (GITHUB_USERNAME && GITHUB_USERNAME !== "your-github-username") {
        new ProjectManager(GITHUB_USERNAME);
    } else {
        const grid = document.getElementById('projects-grid');
        if(grid) grid.innerHTML = `<p class="section-subtitle error">请在 js/projectManager.js 中设置您的 GitHub 用户名。</p>`;
    }
});