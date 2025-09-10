// js/skills.js - 修复并适配新主题的版本

const skillsData = {
    skillBars: [
        { name: '深度学习', level: 90, color: '#4f46e5' },
        { name: '图神经网络', level: 85, color: '#7c3aed' },
        { name: 'Python', level: 95, color: '#3b82f6' },
        { name: '全栈开发', level: 80, color: '#0ea5e9' },
        { name: '数据库', level: 75, color: '#10b981' },
    ],
    radarData: {
        labels: ['编程能力', '创新水平', '团队协作', '学习能力', '自信乐观'],
        values: [80, 85, 95, 80, 75]
    }
};

class SkillsManager {
    constructor() {
        this.radarChart = null;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.injectSkillBarsHTML();
        this.setupIntersectionObserver();
        this.createRadarChart();
        this.listenForThemeChange();
    }

    injectSkillBarsHTML() {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;

        // 创建技能条和雷达图的容器
        skillsSection.innerHTML = `
            <div class="skills-wrapper">
                <div id="skills-bars-container">
                    <h3 class="skills-title">核心能力</h3>
                    ${skillsData.skillBars.map(skill => `
                        <div class="skill-item">
                            <div class="skill-info">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-percentage">0%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" 
                                     data-level="${skill.level}" 
                                     style="--skill-color: ${skill.color}; width: 0%;">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div id="skills-radar-container">
                    <h3 class="skills-title">技能雷达</h3>
                    <div id="radarChartBox">
                        <canvas id="radarChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    setupIntersectionObserver() {
        const barsContainer = document.getElementById('skills-bars-container');
        if (!barsContainer) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars(entry.target);
                    observer.unobserve(entry.target); // 动画只播放一次
                }
            });
        }, { threshold: 0.5 }); // 容器50%可见时触发

        observer.observe(barsContainer);
    }
    
    animateSkillBars(container) {
        const skillItems = container.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                const progress = item.querySelector('.skill-progress');
                const percentageEl = item.querySelector('.skill-percentage');
                const level = parseInt(progress.getAttribute('data-level'), 10);

                progress.style.width = `${level}%`;

                let current = 0;
                const interval = setInterval(() => {
                    if (current < level) {
                        current++;
                        percentageEl.textContent = `${current}%`;
                    } else {
                        clearInterval(interval);
                    }
                }, 20);
            }, index * 100);
        });
    }
    
    getChartThemeOptions() {
        const theme = document.body.getAttribute('data-theme') || 'light';
        const isDark = theme === 'dark';

        return {
            gridColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            labelColor: isDark ? '#f8fafc' : '#475569',
            ticksColor: isDark ? '#94a3b8' : '#64748b',
        };
    }

    createRadarChart() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded!');
            return;
        }
        
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;

        if (this.radarChart) {
            this.radarChart.destroy();
        }

        const themeOptions = this.getChartThemeOptions();

        this.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: skillsData.radarData.labels,
                datasets: [{
                    label: '技能熟练度',
                    data: skillsData.radarData.values,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                    pointBorderColor: '#fff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: themeOptions.gridColor },
                        angleLines: { color: themeOptions.gridColor },
                        pointLabels: { color: themeOptions.labelColor, font: { size: 14 } },
                        ticks: {
                            stepSize: 20,
                            color: themeOptions.ticksColor,
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        });
    }
    
    listenForThemeChange() {
        const themeToggle = document.getElementById('theme-toggle');
        if(themeToggle) {
            themeToggle.addEventListener('click', () => {
                setTimeout(() => {
                    this.createRadarChart();
                }, 100);
            });
        }
    }
}

// 初始化 SkillsManager
new SkillsManager();