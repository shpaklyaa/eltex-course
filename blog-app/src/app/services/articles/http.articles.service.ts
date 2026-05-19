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
import { IArticlesService } from './articles-service.interface';
import { ArticleMapperService } from '../mappers/article-mapper';
import { BackendResponse } from '../mappers/article-mapper';

@Injectable()
export class HttpArticleServiceImpl implements IArticlesService {
    private httpClient = inject(HttpClient);
    private destroyRef = inject(DestroyRef);

    private allArticles = signal<Article[]>([]);
    readonly _allArticles = computed(() => this.allArticles());
    readonly totalCount = computed(() => this.allArticles().length);
    constructor( 
        private store: ArticlesStoreService,
        private articleMapper: ArticleMapperService,
        @Inject(ENV_CONFIG) private env: AppEnvironment
    ) 
    {
        console.log('[HttpArticleServiceImpl] initialized');
    }

    getHello(): void {
        this.httpClient.get('/api/', {responseType: 'text', params: { accept: "accept" }})
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((textResult) => 
            console.log('Response from backend:', textResult));
    }
    
    getAll(page: number = 1, limit: number = 7): Observable<ArtsResponse<Article>> {
        const params = { page: page.toString(), limit: limit.toString() };

        return this.httpClient.get<BackendResponse>('/api/articles', { params }).pipe(
            map(response => {

                const mappedResponse = this.articleMapper.mapToArticles(response);
                this.allArticles.set(mappedResponse.articles);
                this.store.updatePageData(mappedResponse.articles, mappedResponse.total);

                return mappedResponse;
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
        return this.httpClient.get<Article>(`/api/articles/${id}`).pipe(
            catchError(err => {
                console.warn('GET /articles/:id NOT FOUND', err);
                return of(undefined);
            }),
        takeUntilDestroyed(this.destroyRef));
    }

    create(articleData: Omit<Article, 'id'>): Observable<Article> {
        const formData = new FormData();
        formData.append('title', articleData.title);
        formData.append('content', articleData.content);
        if (articleData.image) {
            formData.append('image', articleData.image);
        }

        return this.httpClient.post<Article>('/api/articles', formData).pipe(
        catchError(err => {
            console.error('POST /articles ERROR', err);
            throw err;
        }),
        takeUntilDestroyed(this.destroyRef));
    }

    update(updatedArticle: Article): Observable<Article> {
        const formData = new FormData();
        formData.append('title', updatedArticle.title);
        formData.append('content', updatedArticle.content);
        if (updatedArticle.image) {
            formData.append('image', updatedArticle.image);
        }

        return this.httpClient.patch<Article>(`/api/articles/${updatedArticle.id}`, formData).pipe(
        catchError(err => {
            console.error('PATCH /articles ERROR', err);
            throw err;
        }),
        takeUntilDestroyed(this.destroyRef));
    }

    delete(id: string): Observable<void> {
        return this.httpClient.delete<void>(`/api/articles/${id}`).pipe(
        catchError(err => {
            console.error('DELETE /articles ERROR', err);
            throw err;
        }),
        takeUntilDestroyed(this.destroyRef));
    } 

    getTotalCount(): Observable<number> {
        return this.httpClient.get<Article[]>('/api/articles').pipe(
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