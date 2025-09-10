
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');

    // 1. 强制初始化：页面加载时，无论如何都移除所有 active 类
    timelineItems.forEach(item => {
        item.classList.remove('active');
    });

    // 2. 为每个“圆点”添加点击事件
    timelineItems.forEach(item => {
        const dot = item.querySelector('.timeline-dot');
        const content = item.querySelector('.timeline-content'); // 卡片也可以点击

        // 创建一个可复用的切换函数
        const toggleItem = () => {
            const isAlreadyActive = item.classList.contains('active');

            // 先关闭所有其他的项
            timelineItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // 然后切换当前项的状态
            if (isAlreadyActive) {
                item.classList.remove('active');

            } else {
                item.classList.add('active');
            }
        };

        // 让圆点和整个卡片都具备点击功能
        if (dot) {
            dot.addEventListener('click', (event) => {
                // 阻止事件冒泡，防止触发两次
                event.stopPropagation(); 
                toggleItem();
            });
        }
        if (content) {
            content.addEventListener('click', toggleItem);
        }
    });
});