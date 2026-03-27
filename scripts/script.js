document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const openBtn = document.querySelector('#open-btn');
    const closeBtn = document.querySelector('#close-btn');
    const statsModal = document.querySelector('#stats-modal');
    const openStatsBtn = document.querySelector('#show-stats-btn');
    const countDisplay = document.querySelector('#posts-count'); 

    //Открытие модального окна формы
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
             modal.showModal();
        });
    }

    //Закрытие модального окна формы по кнопке
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.close();
        });
    }

    //Закрытие модального окна формы по клику вне ее блока
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    }

    //Открытие и закрытие модального окна статистики
    if (openStatsBtn && statsModal) {
        openStatsBtn.addEventListener('click', () => {
            const articles = document.querySelectorAll('[id="post"]');
            if (countDisplay) {
                countDisplay.textContent = articles.length;
            }
            
            statsModal.showModal();
        });
        
        statsModal.addEventListener('click', (event) => {
            if (event.target === statsModal) {
                statsModal.close();
            }
        });
    }

    const blogsGrid = document.querySelector('.blogs-grid');
    const addForm = document.querySelector('.blog-form');
    
    //Добавление формы
    addForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();

        const template = document.getElementById('article-template');
        if (!template) {
            console.error('Шаблон article-template не найден!');
            return;
        }
        const newArticle = document.importNode(template.content, true);

        const titleEl = newArticle.querySelector('.article-title');
        const contentEl = newArticle.querySelector('.article-content');
        const dateEl = newArticle.querySelector('.article-date');

        if (!titleEl || !contentEl) {
            console.error('Не найдены .article-title или .article-content в шаблоне');
            return;
        }

        titleEl.textContent = title;
        contentEl.textContent = content;
        dateEl.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        blogsGrid.appendChild(newArticle);

        if (modal) modal.close();
            addForm.reset();

        console.log('Статья добавлена');
    });
    
    //Удаление формы
    blogsGrid.addEventListener('click', function (event) {
        const deleteBtn = event.target.closest('.delete-btn');
        if (!deleteBtn) return;

        const articleCard = deleteBtn.closest('.mini-blog');
        if (articleCard) {
            articleCard.remove();
            console.log('Статья удалена');
        }
    });
});