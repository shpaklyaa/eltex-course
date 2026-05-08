import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article } from '../../types/article';
import { ArticlesStoreService } from './articles-store.service';

function getStoredArticles(): Article[] {
  const data = localStorage.getItem('articles');
  return data ? JSON.parse(data) : [];
}

@Injectable()
export class ArticlesServiceImpl {
  private allArticles: Article[] = getStoredArticles();

  constructor(private store: ArticlesStoreService) {}

  refreshFromStorage(): void {
    const stored = localStorage.getItem('articles');
    this.allArticles = stored ? JSON.parse(stored) : [];
    }

  getAll(page: number = 1, limit: number = 7): Observable<{ articles: Article[]; total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const articles = this.allArticles.slice(start, end);
    return of({ articles, total: this.allArticles.length });
  }

  getById(id: string): Observable<Article | undefined> {
    const article = this.allArticles.find(a => a.id === id);
    return of(article);
  }

  create(articleData: Omit<Article, 'id'>): Observable<Article> {
    const newId = crypto.randomUUID();
    const newArticle: Article = { id: newId, ...articleData };
    this.allArticles.push(newArticle);
    localStorage.setItem('articles', JSON.stringify(this.allArticles));
    return of(newArticle);
  }

  update(updatedArticle: Article): Observable<Article> {
    const index = this.allArticles.findIndex(a => a.id === updatedArticle.id);
    if (index === -1) {
      throw new Error(`Article with id ${updatedArticle.id} not found`);
    }
    this.allArticles[index] = updatedArticle;
    localStorage.setItem('articles', JSON.stringify(this.allArticles));
    return of(updatedArticle);
  }

  delete(id: string): Observable<void> {
    const index = this.allArticles.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Article with id ${id} not found`);
    }
    this.allArticles.splice(index, 1);
    localStorage.setItem('articles', JSON.stringify(this.allArticles));
    return of(undefined);
  }

  getTotalCount(): Observable<number> {
    return of(this.allArticles.length);
  }
}