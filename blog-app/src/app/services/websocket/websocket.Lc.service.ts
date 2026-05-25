import { Injectable, Signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { signal } from '@angular/core';
import { IWebsocketConnectService } from './websocket-connect.service.interface';
import { ConnectWsStatus } from './ws.types';

@Injectable()
export class MockWsService implements IWebsocketConnectService {
  private connectionStatus = signal<ConnectWsStatus>('disconnected');

  private readonly commentCreated$ = new BehaviorSubject<any>(null);
  private readonly commentRatingChanged$ = new BehaviorSubject<any | null>(null);
  private readonly articleRatingChanged$ = new BehaviorSubject<any | null>(null);

    constructor() {
        console.log('MockWsService: Используется заглушка для localStorage');
    }

    subscribeAll(): void {
        console.log('MockWsService: subscribeAll вызван');
    }

    subscribeToArticle(articleId: string): void {
        console.log(`MockWsService: subscribeToArticle(${articleId})`);
    }

    unsubscribeFromArticle(articleId: string): void {
        console.log(`MockWsService: unsubscribeFromArticle(${articleId})`);
    }

    getCommentCreated(): Observable<any> {
        return this.commentCreated$.asObservable();
    }

    getCommentRatingChanged(): Observable<any> {
        return this.commentRatingChanged$.asObservable();
    }

    getArticleRatingChanged(): Observable<any> {
        return this.articleRatingChanged$.asObservable();
    }

    getConnectionStatus(): Signal<ConnectWsStatus> {
        return this.connectionStatus.asReadonly();
    }

    disconnect(): void {
        console.log('MockWsService: disconnect вызван');
    }
}