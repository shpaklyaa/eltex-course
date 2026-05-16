import { Injectable, signal, effect, computed, inject, Inject} from '@angular/core';
import { Article } from '../../types/article';
import { ARTICLES_SERVICE } from './articles-service.token';
import { ArticlesStoreService } from './articles-store.service';
import { HttpClient } from '@angular/common/http';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ENV_CONFIG } from '../../tokens/env.token';
import { AppEnvironment} from '../../../environments/environment.interface'
import { ArtsResponse } from '../../types/artsResponse';

@Injectable()
export class HttpArticleServiceImpl {
    private httpClient = inject(HttpClient);
    private destroyRef = inject(DestroyRef);

    private allArticles = signal<Article[]>([]);
    readonly _allArticles = computed(() => this.allArticles());
    readonly totalCount = computed(() => this.allArticles().length);
    constructor( 
        private store: ArticlesStoreService,
        @Inject(ENV_CONFIG) private env: AppEnvironment
    ) 
    {
        console.log('[HttpArticleServiceImpl] initialized');
    }

    getHello(): void {
        this.httpClient.get('http://localhost:3000/', {responseType: 'text', params: { accept: "accept" }})
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((textResult) => 
            console.log('Response from backend:', textResult));
    }
    
    getAll(page: number = 1, limit: number = 7): Observable<ArtsResponse<Article>> {
        const params = { page: page.toString(), limit: limit.toString() };

        return this.httpClient.get<any>('http://localhost:3000/articles', { params }).pipe(
            map(response => {
                const articles: Article[] = Array.isArray(response?.items)
                    ? response.items
                    : [];

                const total: number = typeof response?.total === 'number'
                    ? response.total
                    : articles.length;

                this.allArticles.set(articles);
                this.store.updatePageData(articles, total);
                return {
                    articles,
                    total
                };
            }),
            catchError(err => {
                console.error('GET /articles ERR', err);
                return of({
                    articles: [],
                    total: 0
                } as ArtsResponse<Article>);
            }),
            takeUntilDestroyed(this.destroyRef)
        );
    }


    getById(id: string): Observable<Article | undefined> {
        console.log('[HTTP] GET /articles/:id with ID:', id);
        return this.httpClient.get<Article>(`http://localhost:3000/articles/${id}`).pipe(
            catchError(err => {
                console.warn('GET /articles/:id NOT FOUND', err);
                return of(undefined);
            }),
        takeUntilDestroyed(this.destroyRef));
    }

    create(articleData: Omit<Article, 'id'>): Observable<Article> {
        return this.httpClient.post<Article>('http://localhost:3000/articles', articleData).pipe(
        map(newArticle => {
            this.allArticles.update(articles => [...articles, newArticle]);
            this.store.updatePageData(this.allArticles(), this.allArticles().length);
            console.log('Sending article data to backend:', articleData);
            return newArticle;
        }),
        catchError(err => {
            console.error('POST /articles ERROR', err);
            throw err;
        }),
        takeUntilDestroyed(this.destroyRef));
    }

    update(updatedArticle: Article): Observable<Article> {
        return this.httpClient.patch<Article>(`http://localhost:3000/articles/${updatedArticle.id}`, updatedArticle).pipe(
        map(() => {
            this.allArticles.update(articles => {
            const index = articles.findIndex(a => a.id === updatedArticle.id);
            if (index === -1) {
                throw new Error(`Article with id ${updatedArticle.id} not found`);
            }
            const updatedArticles = [...articles];
            updatedArticles[index] = updatedArticle;
            return updatedArticles;
            });
            this.store.updatePageData(this.allArticles(), this.allArticles().length);
            return updatedArticle;
        }),
        catchError(err => {
                console.error('PUT /articles/:id ERROR', { id: updatedArticle.id, error: err.message });
                throw err;
            }),
        takeUntilDestroyed(this.destroyRef));
    }

    delete(id: string): Observable<void> {
        return this.httpClient.delete<void>(`http://localhost:3000/articles/${id}`).pipe(
            map(() => {
                this.allArticles.update(articles => {
                const index = articles.findIndex(a => a.id === id);
                if (index === -1) {
                    throw new Error(`Article with id ${id} not found`);
                }
                const updatedArticles = [...articles];
                updatedArticles.splice(index, 1);
                return updatedArticles;
                });
                this.store.updatePageData(this.allArticles(), this.allArticles().length);
            }),
            catchError(err => {
                console.error('DELETE /articles/:id ERROR', { id, error: err.message });
                throw err;
            }),
        takeUntilDestroyed(this.destroyRef));
    } 

    getTotalCount(): Observable<number> {
        return this.httpClient.get<Article[]>('http://localhost:3000/articles').pipe(
        map(articles => {
            this.allArticles.set(articles);
            return articles.length;
        }),
            catchError(err => {
                console.error('GET /articles/count ERROR', err);
                return of(0);
            }),
        takeUntilDestroyed(this.destroyRef));
    }
}