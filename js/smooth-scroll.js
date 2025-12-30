/**
 * SmoothScroll
 * 处理锚点链接的平滑滚动，并进行精确的偏移位置计算
 */
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    
    // 获取所有以 # 开头的锚点链接
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // 获取目标 ID
            const targetId = this.getAttribute('href');
            
            // 如果是 "#" 或空，则不处理
            if (targetId === '#' || !targetId) return;

            // 阻止默认跳转行为
            e.preventDefault();

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 核心修正：我们需要使用 Header 在 "sticky" 状态下的高度
                // 因为跳转后，页面通常会滚动，Header 会变为收缩状态
                let finalHeaderHeight = 0;
                if (header) {
                    // 记录当前是否已经是 sticky
                    const wasSticky = header.classList.contains('sticky');
                    
                    // 关键修复：临时禁用 transition 以获取准确的高度测量值
                    // 否则 transition 会导致 offsetHeight 返回动画开始前的高度
                    const originalTransition = header.style.transition;
                    header.style.transition = 'none';

                    // 如果不是，临时加上 sticky 类来测量高度
                    if (!wasSticky) header.classList.add('sticky');
                    
                    finalHeaderHeight = header.offsetHeight;
                    
                    // 恢复原状
                    if (!wasSticky) header.classList.remove('sticky');
                    
                    // 恢复 transition
                    header.style.transition = originalTransition;
                }

                // 计算目标元素的绝对位置
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - finalHeaderHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
