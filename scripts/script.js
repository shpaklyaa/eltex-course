document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const openBtn = document.querySelector('#open-btn');
    const closeBtn = document.querySelector('#close-btn');
    const statsModal = document.querySelector('#stats-modal');
    const openStatsBtn = document.querySelector('#show-stats-btn');
    const countDisplay = document.querySelector('#posts-count'); 

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.showModal();
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.close();
        });
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    }

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

    const addArticleBtn = document.querySelector('.blog-form-btn');
    const blogsGrid = document.querySelector('.blogs-grid');
    const addForm = document.querySelector('.blog-form');
    const articleTemplate = document.querySelector('#article-template');

    if (addForm && blogsGrid && articleTemplate) {
        addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const clone = articleTemplate.content.cloneNode(true);
        blogsGrid.appendChild(clone);

        if (modal) modal.close();
            addForm.reset();
        });
    }
});