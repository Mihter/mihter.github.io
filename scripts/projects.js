document.addEventListener('DOMContentLoaded', async function () {
    console.log('1. Projects page loaded');

    //проверка загрузки модуля
    if (!window.ProjectsLoader) {
        console.error('ProjectsLoader не загружен');
        return;
    }

    const { loadProjects, filterProjectsByTag, sortProjects, renderProjectCard, PROJECTS_CONFIG } = window.ProjectsLoader;

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter') || 'recent';
    console.log('2. Фильтр из URL:', filter);

    //есть ли фильтр в конфигурации
    if (!PROJECTS_CONFIG[filter]) {
        console.warn(`Фильтр "${filter}" не найден, используем "recent"`);
    }
    const currentFilter = PROJECTS_CONFIG[filter] ? filter : 'recent';
    const config = PROJECTS_CONFIG[currentFilter];
    console.log('3. Конфигурация:', config);

    //загрузка проектов
    const allProjects = await loadProjects();
    console.log('4. Загружено проектов:', allProjects.length);

    //фильтрация
    let filtered = filterProjectsByTag(allProjects, currentFilter);
    filtered = sortProjects(filtered);
    console.log(`5. Отфильтровано (${currentFilter}):`, filtered.length);

    //рендеринг
    renderProjectsPage(currentFilter, config, filtered, PROJECTS_CONFIG);
});

function renderProjectsPage(currentFilter, config, projects, allConfigs) {
    const content = document.getElementById('content');

    //кнопки
    let buttonsHTML = '';
    Object.keys(allConfigs).forEach(filterId => {
        const filterConfig = allConfigs[filterId];
        const isActive = filterId === currentFilter;
        buttonsHTML += `
            <a href="?filter=${filterId}" class="filter-btn ${isActive ? 'active' : ''}">
                ${filterConfig.label}
            </a>
        `;
    });

    //карточки проектов
    let projectsHTML = '';
    if (projects.length === 0) {
        projectsHTML = `<p class="no-projects">Нет проектов по этому фильтру</p>`;
    } else {
        projects.forEach(project => {
            projectsHTML += window.ProjectsLoader.renderProjectCard(project, '');
        });
    }

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

    if (window.reinitCursor) window.reinitCursor();
}