import { Injectable } from '@angular/core';
import { Article } from '../types/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesStoreService {
  private _articles: Article[] = [];
  private _currentPage = 1;
  private _pageSize = 7;

  get articles(): Article[] {
    return [...this._articles];
  }

  get currentPage(): number {
    return this._currentPage;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get totalPages(): number {
    return Math.ceil(this._articles.length / this._pageSize);
  }

  set articles(articles: Article[]) {
    this._articles = [...articles];
  }

  set currentPage(page: number) {
    this._currentPage = Math.max(1, page);
  }

  getPaginatedArticles(): Article[] {
    const start = (this._currentPage - 1) * this._pageSize;
    const end = start + this._pageSize;
    return this._articles.slice(start, end);
  }

  saveArticles(articles: Article[]): void {
    this._articles = [...articles];
  }

  savePagination(page: number): void {
    this._currentPage = Math.max(1, page);
  }
}