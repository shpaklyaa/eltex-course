import { Injectable, Inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Article } from '../../types/article';
import { ArticlesStoreService } from './articles-store.service';
import { ArticlesService } from './articles-service.interface';

function getStoredArticles(): Article[] {
  const data = localStorage.getItem('articles');
  return data ? JSON.parse(data) : [];
}

@Injectable()
export class ArticlesServiceImpl implements ArticlesService {
  constructor(private store: ArticlesStoreService) {}

    getAll(): Observable<Article[]> {
        const articles = getStoredArticles();
        this.store.saveArticles(articles);
        return of(this.store.articles);
    }

    getById(id: string): Observable<Article | undefined> {
        const articles = getStoredArticles();
        const article = articles.find(a => a.id === id);
        return of(article);
    }

    create(articleData: Omit<Article, 'id'>): Observable<Article> {
        const newId = crypto.randomUUID();
        const newArticle: Article = {
            id: newId,
            ...articleData
        };
        this.store._articles.update(articles => [...articles, newArticle]);
        return of(newArticle);
    }

    update(updatedArticle: Article): Observable<Article> {
        const currentArticles = this.store._articles();
        const exists = currentArticles.some(a => a.id === updatedArticle.id);

        if (!exists) {
            throw new Error(`Article with id ${updatedArticle.id} not found`);
        }
        this.store._articles.update(articles =>
            articles.map(a => a.id === updatedArticle.id ? updatedArticle : a)
        );
        return of(updatedArticle);
    }

    delete(id: string): Observable<void> {
        const currentArticles = this.store._articles();
        const exists = currentArticles.some(a => a.id === id);
        if (!exists) {
            throw new Error(`Article with id ${id} not found`);
        }
        this.store._articles.update(articles =>
            articles.filter(a => a.id !== id)
        );

        return of(undefined);
    }

    getTotalCount(): Observable<number> {
        const articles = getStoredArticles();
        return of(articles.length);
    }
}