import { Injectable, signal, computed } from '@angular/core';
import { Article } from '../../types/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesStoreService {

  public arts = signal<Article| null>(null);
  private _currentPage = signal<number>(1);
  private _pageSize = signal<number>(7);
  public _totalArticles = signal<number>(0);
  private _currentPageArticles = signal<Article[]>([]);

  readonly currentPage = computed(() => this._currentPage());
  readonly pageSize = computed(() => this._pageSize());
  readonly totalPages = computed(() => Math.ceil(this._totalArticles() / this._pageSize()));
  readonly currentPageArticles = computed(() => this._currentPageArticles());

  readonly latestTwoArticles = computed(() => {
    const articles = this._currentPageArticles();
    return articles.slice(-2);
  });

  constructor() {}

  set currenPage(page: number) {
    this._currentPage.set(Math.max(1, page));
  }

  updatePageData(articles: Article[], total: number): void {
    this._currentPageArticles.set(articles);
    this._totalArticles.set(total);
  }
}