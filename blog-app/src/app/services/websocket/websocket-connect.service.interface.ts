import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectWsStatus } from './ws.types';

export interface IWebsocketConnectService {
  getConnectionStatus(): Signal<ConnectWsStatus>;

  subscribeAll(): void;

  subscribeToArticle(articleId: string): void;

  unsubscribeFromArticle(articleId: string): void;

  getCommentCreated(): Observable<any>;

//   getCommentRatingChanged(): Observable<any>;

//   getArticleRatingChanged(): Observable<any>;

  disconnect(): void;
}