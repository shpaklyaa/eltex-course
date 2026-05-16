import { Injectable, signal, computed, effect, inject, Inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, from } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Coment } from '../../types/coment';
import { PostInteractionsService } from './post-interactions.interface';
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
        return this.httpClient.get<Coment[]>(`http://localhost:3000/comments/article/${articleId}`).pipe(
        catchError(err => {
        console.error('GET /comments/article/:id ERROR', err);
        return of([]);
        }),
        takeUntilDestroyed(this.destroyRef));
    }

    getById(id: string): Observable<Coment[]> {
        return this.httpClient.get<Coment[]>(`http://localhost:3000/comments/article/${id}`, {
        params: { id }
        }).pipe(
        catchError(err => {
            console.error('GET /comments by articleId ERROR', err);
            return of([]);
        }),
        takeUntilDestroyed(this.destroyRef));
    }
  
    create(commentData: Omit<Coment, 'id'>): Observable<Coment> {
        return this.httpClient.post<Coment>('http://localhost:3000/comments', commentData).pipe(
            map(newComment => {
                if (newComment.id) {
                    this.allComments.update(comments => [...comments, newComment]);
                }
                return newComment;
            }),
            catchError(err => {
                console.error('POST /comments ERROR', err);
                throw err;
            }),
            takeUntilDestroyed(this.destroyRef));
    }

    // update(updatedComment: Coment): Observable<Coment> {
    //     return this.httpClient.patch<Coment>(`http://localhost:3000/comments/${updatedComment.id}`, updatedComment).pipe(
    //     map(() => {
    //         this.allComments.update(comments => {
    //         const index = comments.findIndex(a => a.id === updatedComment.id);
    //         if (index === -1) {
    //             throw new Error(`Article with id ${updatedComment.id} not found`);
    //         }
    //         const updatedComments = [...comments];
    //         updatedComments[index] = updatedComment;
    //         return updatedComments;
    //         });
    //         return updatedComment;
    //     }),
    //     catchError(err => {
    //             console.error('PUT /comments/:id ERROR', { id: updatedComment.id, error: err.message });
    //             throw err;
    //         }),
    //     takeUntilDestroyed(this.destroyRef));
    // }
  
    // delete(id: string, articleId: string): Observable<void> {
    //     return this.httpClient.delete<void>(`http://localhost:3000/comments/${id}`).pipe(
    //     map(() => {
    //         this.allComments.update(comments => {
    //             const index = comments.findIndex(a => a.id === id);
    //             if (index === -1) {
    //                 throw new Error(`Article with id ${id} not found`);
    //             }
    //             const updatedComments = [...comments];
    //             updatedComments.splice(index, 1);
    //             return updatedComments;
    //         });
    //     }),
    //     catchError(err => {
    //         console.error('DELETE /comments/:id ERROR', { id, error: err.message });
    //         throw err;
    //     }),
    //     takeUntilDestroyed(this.destroyRef));
    // }
}