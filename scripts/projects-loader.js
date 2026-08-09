// общий модуль для загрузки и фильтрации проектов

const PROJECTS_CONFIG = {
    recent: {
        title: 'Недавние проекты',
        description: 'Все проекты, которые разрабатывались в ближайшие полгода',
        label: 'Недавние'
    },
    pet: {
        title: 'Пет-проекты',
        description: 'Личные проекты для закрепления и улучшения навыков, которые разрабатывал сам или совместно',
        label: 'Пет-проекты'
    },
    study: {
        title: 'Учебные проекты',
        description: 'Проекты, что разрабатывались во время обучения лично и в командах для демонстрации полученных знаний и навыков',
        label: 'Учебные'
    },
    all: {
        title: 'Все проекты',
        description: 'Все проекты, которых касалась моя рука и были достигнуты поставленные результаты',
        label: 'Все'
    }
};

//кеш проектов
let projectsCache = null;

/* Загрузка проектов из жсон */
async function loadProjects() {
    if (projectsCache) return projectsCache;

    try {
        const response = await fetch('../data/projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        projectsCache = data.projects || [];
        return projectsCache;
    } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        return [];
    }
}

/* Фильтрация проектов по тегу */
function filterProjectsByTag(projects, tag) {
    if (tag === 'all') return projects;
    return projects.filter(p => p.tags && p.tags.includes(tag));
}

/* Сортировка проектов по order */
function sortProjects(projects) {
    return [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
}

/* Генерация html карточек проектов */
function renderProjectCard(project, basePath = '') {
    const tags = project.tags ? project.tags.map(t =>
        `<span class="project-tag">${t}</span>`
    ).join('') : '';

    const imagePath = project.image ? project.image.replace('../', basePath) : '';
    const linkPath = project.link || '#';

    return `
        <div class="project-card">
            ${imagePath ? `<img src="${imagePath}" alt="${project.name}" class="project-image" />` : ''}
            <div class="project-card-content">
                <h3>${project.name}</h3>
                <p>${project.description || ''}</p>
                <div class="project-tags">${tags}</div>
                ${project.link ? `<a href="${linkPath}" class="project-link" target="_blank">Смотреть →</a>` : ''}
            </div>
        </div>
    `;
}

// Экспортируем функции
window.ProjectsLoader = {
    loadProjects,
    filterProjectsByTag,
    sortProjects,
    renderProjectCard,
    PROJECTS_CONFIG
};