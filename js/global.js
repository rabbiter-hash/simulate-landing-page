/**
 * Global Interactivity & Animations
 * 使用 IntersectionObserver 实现元素进入视口时的动画
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 定义观察器选项
    const observerOptions = {
        root: null, // 使用视口作为根
        rootMargin: '0px',
        threshold: 0.15 // 元素出现 15% 时触发
    };

    // 2. 创建观察器回调
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 添加可见类，触发 CSS 动画
                entry.target.classList.add('is-visible');
                
                // 动画只执行一次，停止观察
                observer.unobserve(entry.target);
            }
        });
    };

    // 3. 实例化观察器
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 4. 自动查找并观察所有带有 .reveal-item 类的元素
    //    也可以自动选取常见的块级元素，减少 HTML 修改工作量
    const targets = document.querySelectorAll('.reveal-item, section h2, .svc-card, .feature-content, .visual-card, .contact-box, .hero-content > *');
    
    // 辅助函数：获取元素在父容器中的索引，仅计算同类型/同类名的兄弟元素
    function getSiblingIndex(element) {
        if (!element.parentElement) return 0;
        const siblings = Array.from(element.parentElement.children);
        const visibleSiblings = siblings.filter(sib => {
            return sib.tagName !== 'SCRIPT' && sib.tagName !== 'STYLE';
        });
        return visibleSiblings.indexOf(element);
    }

    targets.forEach((el) => {
        // 确保元素有基础动画类
        if (!el.classList.contains('reveal-item')) {
            el.classList.add('reveal-item');
            // 如果没有指定方向，默认向上浮现
            if (!el.classList.contains('reveal-from-top') && 
                !el.classList.contains('reveal-from-left') && 
                !el.classList.contains('reveal-from-right')) {
                el.classList.add('reveal-fade-up');
            }
        }
        
        // 5. 添加交错延迟 (Staggered Delay)
        // 检查是否属于需要交错动画的容器
        const parent = el.parentElement;
        if (parent) {
            let delay = 0;
            const index = getSiblingIndex(el);

            if (parent.classList.contains('services-grid')) {
                // Services 卡片：每个延迟 150ms
                delay = index * 0.15;
            } else if (parent.classList.contains('visual-bottom-row')) {
                // Feature 底部视觉图
                delay = index * 0.2;
            } else if (parent.classList.contains('contact-grid')) {
                // Contact 盒子
                delay = index * 0.15;
            } else if (parent.classList.contains('hero-content')) {
                // Hero 区域内容：依次延迟
                // Hero 区域通常更需要一种叙事感，稍微慢一点
                delay = index * 0.2; 
            } else if (parent.classList.contains('sp-brands')) {
                 // 品牌列表
                 delay = index * 0.1;
            }

            if (delay > 0) {
                el.style.transitionDelay = `${delay}s`;
            }
        }

        observer.observe(el);
    });

    // ------------------
    // Mobile Menu Logic
    // ------------------
    const mobileBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('.site-header'); // 获取 Header 元素

    // 动态计算 Header 高度并设置给菜单
    function setMobileMenuTop() {
        if (window.innerWidth <= 768 && header && navLinks) {
            const headerHeight = header.offsetHeight;
            navLinks.style.top = `${headerHeight}px`;
            navLinks.style.height = `calc(100vh - ${headerHeight}px)`;
        } else if (navLinks) {
            // PC端重置样式，避免影响
            navLinks.style.top = '';
            navLinks.style.height = '';
        }
    }

    // 监听窗口大小变化和滚动（因为Sticky可能会改变Header高度）
    window.addEventListener('resize', setMobileMenuTop);
    window.addEventListener('scroll', setMobileMenuTop, { passive: true });
    
    // 初始化时执行一次
    setMobileMenuTop();

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡，防止触发其他点击事件
            
            // 每次点击打开前重新计算一次高度，确保准确
            setMobileMenuTop();
            
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active'); // Add active class to button
            document.body.classList.toggle('no-scroll'); // 禁止/允许页面滚动

            // 切换图标 (由 CSS 动画接管，移除 JS 图标切换逻辑)
            /*
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
            */
        });

        // 点击链接后自动关闭菜单
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // 点击菜单外部关闭菜单
        document.addEventListener('click', (e) => {
            const isClickInside = navLinks.contains(e.target);
            const isButton = mobileBtn.contains(e.target);
            
            // 特殊处理：如果点击的是 navLinks 本身（可能是点击了伪元素遮罩）
            // 此时 e.target === navLinks
            let isClickOnMask = false;
            if (e.target === navLinks) {
                // 获取菜单实际占据的区域（不包含伪元素）
                const rect = navLinks.getBoundingClientRect();
                // 如果点击的 X 坐标大于菜单的宽度，说明点在了右侧的遮罩上
                if (e.clientX > rect.width) {
                    isClickOnMask = true;
                }
            }

            if (navLinks.classList.contains('active') && (!isClickInside || isClickOnMask) && !isButton) {
                closeMobileMenu();
            }
        });

        // 定义关闭菜单的函数，避免代码重复
        function closeMobileMenu() {
            navLinks.classList.remove('active');
            mobileBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
            // CSS动画自动处理图标复原
        }
    }

    // ------------------
    // Back to Top Logic
    // ------------------
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        // 监听滚动事件，控制按钮显示/隐藏
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // 监听点击事件，平滑滚动回顶部
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
