/**
 * Agrumestly.top - Main Interactive Logic
 * 处理全屏滚动、GSAP 动画及初始化
 */

// 1. 变量定义
let currentSection = 0;
let isAnimating = false;
const sections = document.querySelectorAll(".section");
const dots = document.querySelectorAll(".dot");

// 2. 核心翻页函数
function goToSection(index) {
    // 边界检查及锁定检查
    if (isAnimating || index === currentSection || index < 0 || index >= sections.length) return;
    
    isAnimating = true;
    const direction = index > currentSection ? 1 : -1;
    const outgoing = sections[currentSection];
    const incoming = sections[index];

    // 创建动画时间轴
    const tl = gsap.timeline({
        onComplete: () => {
            outgoing.classList.remove('active');
            isAnimating = false;
            currentSection = index;
        }
    });

    // 退场动画：当前页面向上/下位移并缩小
    tl.to(outgoing, {
        y: direction * -100 + "%",
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: "expo.inOut"
    });

    // 进场动画：新页面从相反方向滑入并放大
    tl.fromTo(incoming, 
        { y: direction * 100 + "%", opacity: 0, scale: 1.1, visibility: 'visible' },
        { y: "0%", opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" },
        "-=0.8" // 与退场动画重叠，视觉更连贯
    );

    // 同步更新侧边圆点 UI
    updateDots(index);
}

// 3. UI 辅助函数
function updateDots(index) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// 4. 事件监听初始化
function initEventListeners() {
    // 监听鼠标滚轮 (带有阈值检测)
    window.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaY) > 50) { 
            if (e.deltaY > 0) {
                goToSection(currentSection + 1);
            } else {
                goToSection(currentSection - 1);
            }
        }
    }, { passive: true });

    // 监听键盘上下键
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") goToSection(currentSection + 1);
        if (e.key === "ArrowUp" || e.key === "PageUp") goToSection(currentSection - 1);
    });

    // 窗口大小改变时重置布局（防止 GSAP 计算错误）
    window.addEventListener("resize", () => {
        gsap.set(sections[currentSection], { y: "0%", opacity: 1, visibility: "visible" });
    });
}

// 5. 启动程序
document.addEventListener("DOMContentLoaded", () => {
    // 注册插件（如果使用了 ScrollTo 等）
    // gsap.registerPlugin(ScrollToPlugin);

    // 初始状态设置
    gsap.set(sections[0], { visibility: 'visible', opacity: 1 });
    
    initEventListeners();
    
    console.log("Agrumestly Core Engine Initialized.");
});