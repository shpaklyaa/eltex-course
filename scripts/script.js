document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('#modal');
  const openBtn = document.querySelector('#open-btn');
  const closeBtn = document.querySelector('#close-btn');
  const statsModal = document.querySelector('#stats-modal');
  const openStatsBtn = document.querySelector('#show-stats-btn');
  const countDisplay = document.querySelector('#posts-count');

  // Открытие модального окна формы
  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.showModal();
    });
  }

  // Закрытие модального окна формы по кнопке
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.close();
    });
  }

  // Закрытие модального окна формы по клику вне её блока
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });
  }

  // Открытие и закрытие модального окна статистики
  if (openStatsBtn && statsModal) {
    openStatsBtn.addEventListener('click', () => {
      const articles = document.querySelectorAll('.blog-article');
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
  const articleTemplate = document.getElementById('article-template');

  let articles = loadArticlesFromLocalStorage();

  // Загрузка статей из localStorage
  function loadArticlesFromLocalStorage() {
    const data = localStorage.getItem('articles');
    return data ? JSON.parse(data) : [];
  }

  // Сохранение статей в localStorage
  function saveArticlesToLocalStorage(articles) {
    localStorage.setItem('articles', JSON.stringify(articles));
  }

  // Рендеринг статей
  articles.forEach(article => {
    const articleElement = document.importNode(articleTemplate.content, true);

    const titleEl = articleElement.querySelector('.article-title');
    const contentEl = articleElement.querySelector('.article-content');
    const dateEl = articleElement.querySelector('.article-date');

    if (!titleEl || !contentEl) {
      console.error('Не найдены .article-title или .article-content в шаблоне');
      return;
    }

    titleEl.textContent = article.title;
    contentEl.textContent = article.content;
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    blogsGrid.appendChild(articleElement);
  });

  updateEmptyState();

  // Добавление статьи
  addForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
      alert('Заполните все поля!');
      return;
    }

    if (!articleTemplate) {
      console.error('Шаблон article-template не найден!');
      return;
    }

    const newArticleElement = document.importNode(articleTemplate.content, true);

    const titleEl = newArticleElement.querySelector('.article-title');
    const contentEl = newArticleElement.querySelector('.article-content');
    const dateEl = newArticleElement.querySelector('.article-date');

    if (!titleEl || !contentEl) {
      console.error('Не найдены .article-title или .article-content в шаблоне');
      return;
    }

    titleEl.textContent = title;
    contentEl.textContent = content;
    dateEl.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'});

    blogsGrid.appendChild(newArticleElement);
    const newArticleData = { title, content };
    articles.push(newArticleData);
    saveArticlesToLocalStorage(articles);

    if (modal) modal.close();
      addForm.reset();
      
    updateEmptyState();

    console.log('Статья добавлена');
  });

  // Удаление статьи
  blogsGrid.addEventListener('click', function (event) {
    const deleteBtn = event.target.closest('.delete-btn');
    if (!deleteBtn) return;

    const articleCard = deleteBtn.closest('.blog-article');
    if (!articleCard) return;

    const title = articleCard.querySelector('.article-title').textContent;
    const index = articles.findIndex(article => article.title === title);

    if (index !== -1) {
        articles.splice(index, 1);
        saveArticlesToLocalStorage(articles);
        articleCard.remove();
    }
    updateEmptyState();
  });

  // Видимость кнопки next и надписи при наличии/отсутствии статей
  function updateEmptyState() {
    const isEmpty = blogsGrid.children.length === 0;
    const postsNotFound = document.querySelector('.posts-not-found');
    const nextPostBtn = document.querySelector('#blogs-btn');

    if (postsNotFound) {
      postsNotFound.hidden = !isEmpty;
    }

    if (nextPostBtn) {
      nextPostBtn.classList.toggle('show', !isEmpty);
    }
  }
});