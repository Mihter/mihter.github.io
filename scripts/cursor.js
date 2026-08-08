// ===== Кастомный курсор =====
document.addEventListener('DOMContentLoaded', function () {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    // Если курсор не найден — выходим
    if (!cursor || !dot || !ring) {
        console.warn('Кастомный курсор не найден');
        return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    // Движение мыши
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Мгновенное движение точки
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Плавное движение кольца (с задержкой)
    function animateRing() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;

        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Скрыть курсор при уходе с окна
    document.addEventListener('mouseleave', function () {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
        cursor.style.opacity = '1';
    });

    // Проверка hover на элементах через JS
    const hoverElements = document.querySelectorAll('.avatar, .project-card, .stack-card, .skill-card, .stack-card, .social a');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function () {
            const classList = this.className;

            // Определяем тип элемента
            if (this.classList.contains('avatar')) {
                dot.style.background = '#a78bfa';
                ring.style.borderColor = 'rgba(167, 139, 250, 0.8)';
                ring.style.width = '60px';
                ring.style.height = '60px';
                dot.style.width = '16px';
                dot.style.height = '16px';
            } else if (this.classList.contains('project-card')) {
                dot.style.background = '#fbbf24';
                ring.style.borderColor = 'rgba(251, 191, 36, 0.8)';
                ring.style.width = '70px';
                ring.style.height = '70px';
                dot.style.width = '12px';
                dot.style.height = '12px';
            } else if (this.classList.contains('skill-card')) {
                dot.style.background = '#60a5fa';
                ring.style.borderColor = 'rgba(96, 165, 250, 0.8)';
                ring.style.width = '50px';
                ring.style.height = '50px';
                dot.style.width = '10px';
                dot.style.height = '10px';
            } else if (this.classList.contains('stack-card')) {
                dot.style.background = '#60a5fa';
                ring.style.borderColor = 'rgba(96, 165, 250, 0.8)';
                ring.style.width = '65px';
                ring.style.height = '65px';
                dot.style.width = '14px';
                dot.style.height = '14px';
            } else if (this.classList.contains('social') || this.tagName === 'A') {
                dot.style.background = '#f472b6';
                ring.style.borderColor = 'rgba(244, 114, 182, 0.8)';
                ring.style.width = '55px';
                ring.style.height = '55px';
                dot.style.width = '14px';
                dot.style.height = '14px';
            }
        });

        el.addEventListener('mouseleave', function () {
            // Возврат исходного размера
            dot.style.background = '#6ee7b7';
            ring.style.borderColor = 'rgba(110, 231, 183, 0.5)';
            ring.style.width = '40px';
            ring.style.height = '40px';
            dot.style.width = '8px';
            dot.style.height = '8px';
        });
    });
});