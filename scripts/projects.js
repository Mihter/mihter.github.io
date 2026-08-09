//Конфигурация стеков
const projectsConfig = {
    recent: {
        title: `Недавние проекты`,
        description: `Все проекты которые разрабатывались в ближайшие пол года`
    },
    pet: {
        title: `Пет проекты`,
        description: `Личные проекты для закрепления и улучшения навыков, которые разрабатывал сам или совместно`
    },
    study: {
        title: `Учебные проекты`,
        description: `Проекты, что разрабатывались во время обучения лично и в командах для демонстрации полученных знаний и навыков`
    },
    all: {
        title: `Все проекты`,
        description: `Все проекты которых касалась моя рука и были достигнуты поставленные результаты`
    }

    }
};

document.addEventListener('DOMContentLoaded', async function () {
    console.log('1. Скрипт запущен');

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter') || 'recent';
    console.log('2. Фильтр проектов из URL:', filter);

    if (!projectsConfig[filter]) {
        console.warn(`Фильтр "${filter}" не найден, используем "recent"`);
        window.location.href = '?filter=recent';
        return;
    }

    const currentFilter = projectsConfig[filter] ? filter : 'recent';
    const config = projectsConfig[currentFilter];
    console.log('3. Конфигурация получена:', config);

    //гружу весь жсон
    console.log('4. Загрузка data/projects.json...');
    let data;
    try {
        const response = await fetch('../data/projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        data = await response.json();
        console.log('5. Данные загружены:', data);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        document.getElementById('content').innerHTML = `
            <a href="../index.html" class="back-link">← Вернуться на главную</a>
            <h1 style="color: #e0e0e0; text-align: center; margin-top: 40px;">Ошибка загрузки проектов</h1>
            <p style="text-align: center; color: #94a3b8;">Не удалось загрузить данные. Попробуйте позже.</p>
        `;
        return;
    }

    // фильтрую проекты
    let projects = data.projects || [];
    if (currentFilter !== 'all') {
        projects = projects.filter(p => p.tags && p.tags.includes(currentFilter));
    }
    // сортирую по order
    projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    console.log(`6. Отфильтровано проектов (${currentFilter}):`, projects.length);

    // рендеринг
    renderProjectsPage(currentFilter, config, projects);
    console.log('7. Страница отрендерена');
});

function renderProjectsPage(currentFilter, config, projects) {
    const content = document.getElementById('content');
    document.title = config.title;

    //кнопки фильтров из конфига
    let buttonsHTML = '';
    Object.keys(projectsConfig).forEach(filterId => {
        const filterConfig = projectsConfig[filterId];
        if (!filterConfig) return;

        const isActive = filterId === currentFilter;
        buttonsHTML += `
            <a href="?filter=${filterId}" class="filter-btn ${isActive ? 'active' : ''}">
                ${filterConfig.label}
            </a>
        `;
    });

    // карточки проектов
    let projectsHTML = '';
    if (projects.length === 0) {
        projectsHTML = `<p class="no-projects">Нет проектов по этому фильтру</p>`;
    } else {
        projects.forEach(project => {
            const tags = project.tags ? project.tags.map(t =>
                `<span class="project-tag">${t}</span>`
            ).join('') : '';

            projectsHTML += `
                <div class="project-card">
                    ${project.image ? `<img src="${project.image}" alt="${project.name}" class="project-image" />` : ''}
                    <div class="project-card-content">
                        <h3>${project.name}</h3>
                        <p>${project.description || ''}</p>
                        <div class="project-tags">${tags}</div>
                        ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">Смотреть →</a>` : ''}
                    </div>
                </div>
            `;
        });
    }

    //вся страница
    content.innerHTML = `
        <a href="../index.html" class="back-link">← Вернуться на главную</a>
        
        <h1 class="projects-page-title">Мои проекты</h1>
        
        <div class="filter-buttons">
            ${buttonsHTML}
        </div>
        
        <div class="filter-description">
            <p>${config.description}</p>
        </div>
        
        <div class="projects-grid">
            ${projectsHTML}
        </div>
    `;

    if (window.reinitCursor) {
        window.reinitCursor();
    }
}