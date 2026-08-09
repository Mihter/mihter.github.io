//Скрипт для загрузки некоторых проктов

document.addEventListener('DOMContentLoaded', async function () {
    console.log('1. загрузка проектов');

    if (!window.ProjectsLoader) {
        console.error('Модуль для загружки проектов отсутствует');
        return;
    }

    const { loadProjects, filterProjectsByTag, sortProjects, renderProjectCard } = window.ProjectsLoader;

    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) {
        console.warn('Контейнер .projects-grid не найден на странице');
        return;
    }

    console.log('2. Загрузка проектов...');
    const allProjects = await loadProjects();
    console.log('3. Загружено проектов:', allProjects.length);

    //фильтрую по тегу
    let topProjects = filterProjectsByTag(allProjects, 'top');
    topProjects = sortProjects(topProjects);
    console.log('4. Топ-проектов:', topProjects.length);

    //на всякий показать последние 3, если не назначу
    if (topProjects.length === 0) {
        console.log('Нет проектов с тегом "top", показаны последние 3');
        topProjects = sortProjects(allProjects).slice(0, 3);
    }

    //рендеринг
    let projectsHTML = '';
    if (topProjects.length === 0) {
        projectsHTML = `<p class="no-projects" style="grid-column: 1/-1; text-align: center; color: #94a3b8;">Пока нет проектов</p>`;
    } else {
        topProjects.forEach(project => {
            projectsHTML += renderProjectCard(project, '');
        });
    }

    projectsGrid.innerHTML = projectsHTML;
    console.log('5. Карточки отрендерены');
});