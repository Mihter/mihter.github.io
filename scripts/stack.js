//Конфигурация стеков
const stackConfig = {
    backend: {
        title: 'Backend',
        color: '#a78bfa',
        gradient: 'linear-gradient(135deg, #a78bfa, #6ee7b7)',
        subtitle: 'Строю надёжные и масштабируемые серверные решения',
        description: `
            Самый большой опыт у меня в бекенде — с 2022 года.
            Основа моего стека — ASP.NET Core и стандартные библиотеки для этого фреймворка:
            EFCore, Serilog.
        `
    },
    frontend: {
        title: 'Frontend',
        color: '#61dafb',
        gradient: 'linear-gradient(135deg, #61dafb, #f7df1e)',
        subtitle: 'Создаю красивые и отзывчивые интерфейсы',
        description: `
            В том или ином виде фронтендом я занимаюсь с 2024 года,
            когда я учился верстать страницы и делать SPA-приложения начиная с простого todo-листа.
            С тех пор я время от времени создавал реактивные веб-приложения в рамках практик и учебных проектов.
            Из недавнего пробовал силы в разработке расширения для браузера html/js.
        `
    },
    devops: {
        title: 'DevOps',
        color: '#6ee7b7',
        gradient: 'linear-gradient(135deg, #6ee7b7, #60a5fa)',
        subtitle: 'Автоматизирую развёртывание и управление инфраструктурой',
        description: `
            Я начал изучать DevOps и системное администрирование
            примерно в 2023 году, когда начал разрабатывать ботов для Discord
            и пробовал силы в разработке мессенджера на фоне блокировки discord.
            Для ботов была необходимость в контейнеризации и администрировании
            на протяжении всей работы, для удобства развертывания новых версий и испрвления багов.
        `
    }
};

document.addEventListener('DOMContentLoaded', async function () {
        console.log('1. Скрипт запущен');

        //беру название стека из url
        const params = new URLSearchParams(window.location.search);
        const stack = params.get('stack') || 'backend';
        console.log('2. Стек из URL:', stack);

        //гружу весь жсон
        console.log('3. Пытаюсь загрузить data/techs.json...');
        const response = await fetch('../data/techs.json');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('4. Данные загружены:', data);

        //фильтрую технологии по сходству стека
        const techs = data.techs
            .filter(tech => tech.tags.includes(stack))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
        console.log('5. Отфильтровано технологий:', techs.length);

        //для стека из url выбираю конфигурацию
        const config = stackConfig[stack];
        if (!config) {
            document.getElementById('content').innerHTML = '<h1 style="color: #e0e0e0;">Стек не найден</h1>';
            return;
        }
        console.log('6. Конфигурация получена');

        //генерирую html под стек
        renderStackPage(stack, config, techs);
        console.log('7. Страница отрендерена');
});

function renderStackPage(stack, config, techs) {
    const content = document.getElementById('content');

    document.title = `${config.title}`;

    let techsHTML = '';
    techs.forEach(tech => {
        techsHTML += `
            <div class="tech-item" style="border-color: ${config.color}33;">
                <img src="${tech.image}" alt="${tech.name}" />
                <span>${tech.name}</span>
                ${tech.description ? `<div class="tech-desc">${tech.description}</div>` : ''}
            </div>
        `;
    });

    content.innerHTML = `
        <a href="../index.html" class="back-link">← Вернуться на главную</a>
        
        <h1 class="stack-page-title" style="background: ${config.gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${config.title}
        </h1>
        <p class="stack-page-subtitle">${config.subtitle}</p>
        
        <div class="stack-description" style="border-left-color: ${config.color};">
            <p>${config.description}</p>
        </div>
        
        <h2 style="color: #e0e0e0; margin-top: 30px;">Технологии</h2>
        <div class="tech-grid">
            ${techsHTML || '<p style="color: #94a3b8;">Нет технологий в этом стеке</p>'}
        </div>
    `;
}