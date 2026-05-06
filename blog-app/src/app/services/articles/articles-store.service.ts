import { Injectable, signal, computed, effect } from '@angular/core';
import { Article } from '../../types/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesStoreService {
  public _articles = signal<Article[]>([]);
  public arts = this._articles;
  private _currentPage = signal<number>(1);
  private _pageSize = signal<number>(7);

  readonly allArticles = computed(() => this._articles());
  readonly curPage = computed(() => this._currentPage());
  readonly pageSize = computed(() => this._pageSize());
  readonly totalPages = computed(() => Math.ceil(this._articles().length / this._pageSize()));

  readonly currentPageArticles = computed(() => {
    const page = this._currentPage();
    const size = this._pageSize();
    const articles = this._articles();
    const start = (page - 1) * size;
    return articles.slice(start, start + size);
  });

  readonly latestTwoArticles = computed(() => {
    const articles = this._articles();
    return articles.slice(-2);
  });

  constructor() {
    const stored = localStorage.getItem('articles');
    const parsed: Article[] = stored ? JSON.parse(stored) : [];
    this._articles.set(Array.isArray(parsed) ? parsed : []);

    effect(() => {
      const articles = this._articles();
      localStorage.setItem('articles', JSON.stringify(articles));
    });
  }

  set articles(articles: Article[]) {
    const currentArticles = this._articles();
    this._articles.set([...currentArticles])
  }

  set currentPage(page: number) {
    this._currentPage.set(Math.max(1, page));
  }

  getPaginatedArticles(): Article[] {
    const start = (this._currentPage() - 1) * this._pageSize();
    const end = start + this._pageSize();
    return this._articles().slice(start, end);
  }

  saveArticles(articles: Article[]): void {
    const currentArticles = this._articles();
    this._articles.set([...currentArticles])
  }

  savePagination(page: number): void {
    this._currentPage.set(Math.max(1, page));
  }
}