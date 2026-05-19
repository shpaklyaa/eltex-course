import { Injectable, signal, computed, effect, inject, Inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, from } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Coment } from '../../types/coment';
import { IPostInteractionsService } from './post-interactions.interface';
import { PostInteractionsStoreService } from './post-interactions-store.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ENV_CONFIG } from '../../tokens/env.token';
import { AppEnvironment} from '../../../environments/environment.interface'

@Injectable({
  providedIn: 'root',
})
export class HttpPostInteractionsServiceImpl {

    private httpClient = inject(HttpClient);
    private destroyRef = inject(DestroyRef);

    constructor(
    private store: PostInteractionsStoreService,
    @Inject(ENV_CONFIG) private env: AppEnvironment
    ) {}

    private allComments = signal<Coment[]>([]);
    private ratings = signal<{ commentId: string; value: number }[]>([]);

    getCommentsForArticle(articleId: string): Observable<Coment[]> {
        return this.httpClient.get<Coment[]>(`/api/comments/article/${articleId}`).pipe(
        catchError(err => {
        console.error('GET /comments/article/:id ERROR', err);
        return of([]);
        }),
        takeUntilDestroyed(this.destroyRef));
    }

    getById(id: string): Observable<Coment[]> {
        return this.httpClient.get<Coment[]>(`/api/comments/article/${id}`, {
        params: { id }
        }).pipe(
        catchError(err => {
            console.error('GET /comments by articleId ERROR', err);
            return of([]);
        }),
        takeUntilDestroyed(this.destroyRef));
    }
  
    create(commentData: Omit<Coment, 'id'>): Observable<Coment> {
        return this.httpClient.post<Coment>('/api/comments', commentData).pipe(
            catchError(err => {
                console.error('POST /comments ERROR', err);
                throw err;
            }),
            takeUntilDestroyed(this.destroyRef));
    }
}