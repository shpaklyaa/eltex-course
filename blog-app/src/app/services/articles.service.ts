import { Injectable, Inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Article } from '../types/article';
import { ArticlesStoreService } from './articles-store.service';
import { ArticlesService } from './articles-service.interface';

function getStoredArticles(): Article[] {
  const data = localStorage.getItem('articles');
  return data ? JSON.parse(data) : [];
}

function saveToStorage(articles: Article[]): void {
  localStorage.setItem('articles', JSON.stringify(articles));
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesServiceImpl implements ArticlesService {
  constructor(private store: ArticlesStoreService) {}

    getAll(): Observable<Article[]> {
        const articles = getStoredArticles();
        this.store.saveArticles(articles);
        return of(articles);
    }

    getById(id: string): Observable<Article | undefined> {
        const articles = getStoredArticles();
        const article = articles.find(a => a.id === id);
        return of(article);
    }

    create(articleData: Omit<Article, 'id'>): Observable<Article> {
        const articles = getStoredArticles();
        const newId = crypto.randomUUID();
        const newArticle: Article = {
            id: newId,
            ...articleData
        };
        const updatedArticles = [...articles, newArticle];
        saveToStorage(updatedArticles);
        this.store.saveArticles(updatedArticles);
        return of(newArticle);
    }

    update(updatedArticle: Article): Observable<Article> {
        const articles = getStoredArticles();
        const index = articles.findIndex(a => a.id === updatedArticle.id);
        if (index === -1) {
            throw new Error(`Article with id ${updatedArticle.id} not found`);
        }
        const updatedArticles = [...articles];
        updatedArticles[index] = updatedArticle;
        saveToStorage(updatedArticles);
        this.store.saveArticles(updatedArticles);
        return of(updatedArticle);
    }

    delete(id: string): Observable<void> {
        const articles = getStoredArticles();
        const updatedArticles = articles.filter(a => a.id !== id);
        saveToStorage(updatedArticles);
        this.store.saveArticles(updatedArticles);
        return of(undefined);
    }

    getTotalCount(): Observable<number> {
        const articles = getStoredArticles();
        return of(articles.length);
    }
}