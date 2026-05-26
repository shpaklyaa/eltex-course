import { Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EwsEvents } from './ws-event.enum';
import { ConnectWsStatus } from './ws.types';
import { IWebsocketConnectService } from './websocket-connect.service.interface';
import { Coment } from '../../types/coment';

@Injectable()
export class WebSocketIoService implements IWebsocketConnectService, OnDestroy {
  private socket?: Socket;
  private connectionStatus = signal<ConnectWsStatus>('disconnected');

  private readonly commentCreated$ = new BehaviorSubject<Coment | null>(null);
  private readonly commentRatingChanged$ = new BehaviorSubject<any | null>(null);
  private readonly articleRatingChanged$ = new BehaviorSubject<any | null>(null);

  constructor() {
    this.initSocket();
  }

  private initSocket(): void {
    if (this.socket?.connected) return;

    this.socket = io('ws://localhost:3000/events', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.connectionStatus.set('connected');
      console.log('Websocket: соединение установлено')
    });

    this.socket.on('error', () => {
      this.connectionStatus.set('error');
      console.log('Websocket: соединение разорвано')
    });

  }

  subscribeAll(): void {
    this.socket?.emit('subscribe-all', () => {});
  }

  subscribeToArticle(articleId: string): void {
    if(!this.socket) return;

    this.socket.off(EwsEvents.COMMENT_CREATED);
    this.socket.off(EwsEvents.ARTICLE_RATING_CHANGED);
    this.socket.off(EwsEvents.COMMENT_RATING_CHANGED);

    this.socket?.emit('subscribe-article', articleId);

    this.socket.on(EwsEvents.COMMENT_CREATED, (message) => {
        this.commentCreated$.next(message.payload ?? message);
    });

    this.socket.on(EwsEvents.ARTICLE_RATING_CHANGED, (message) => {
        this.articleRatingChanged$.next(message.payload ?? message);
    });

    this.socket.on(EwsEvents.COMMENT_RATING_CHANGED, (message) => {
        this.commentRatingChanged$.next(message.payload ?? message);
    });
  }

  unsubscribeFromArticle(articleId: string): void {
    this.socket?.emit('unsubscribe-article', articleId);

    this.socket?.off(EwsEvents.COMMENT_CREATED);
    this.socket?.off(EwsEvents.ARTICLE_RATING_CHANGED);
    this.socket?.off(EwsEvents.COMMENT_RATING_CHANGED);
  }

  getCommentCreated(): Observable<Coment | null> {
    return this.commentCreated$.asObservable()
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
    if (this.socket) {
      this.socket?.disconnect();
      this.socket = undefined;
      this.connectionStatus.set('disconnected');
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}