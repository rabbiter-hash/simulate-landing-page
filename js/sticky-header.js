/**
 * StickyHeader 功能
 * 管理顶部导航栏的吸顶交互
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    
    if (!header) {
        console.warn('StickyHeader: 未找到 .site-header 元素');
        return;
    }

    // 滚动阈值，超过这个值就认为是吸顶状态
    const threshold = 50;

    const handleScroll = () => {
        // 获取当前垂直滚动距离，兼容不同浏览器
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY > threshold) {
            if (!header.classList.contains('sticky')) {
                header.classList.add('sticky');
            }
        } else {
            if (header.classList.contains('sticky')) {
                header.classList.remove('sticky');
            }
        }
    };

    // 监听滚动事件
    // passive: true 告诉浏览器我们不会调用 preventDefault()，有助于提升滚动性能
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 页面加载时立即检测一次（处理刷新后页面停留在中间的情况）
    handleScroll();
});
