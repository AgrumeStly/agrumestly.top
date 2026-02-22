function setLanguage(lang) {
    // 1. 保存选择到本地存储，下次打开还是这个语言
    localStorage.setItem('preferred-lang', lang);

    // 2. 遍历所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // 如果是 HTML（如包含 <br>），使用 innerHTML；否则用 textContent
            if (translations[lang][key].includes('<')) {
                element.innerHTML = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // 3. 更新按钮样式
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.style.opacity = btn.getAttribute('onclick').includes(lang) ? "1" : "0.5";
    });
}

// 页面加载时初始化语言
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred-lang') || 'zh';
    setLanguage(savedLang);
});