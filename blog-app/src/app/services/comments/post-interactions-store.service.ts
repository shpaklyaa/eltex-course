import { Injectable, signal, computed, effect } from '@angular/core';
import { Coment } from '../../types/coment';

@Injectable({
  providedIn: 'root'
})
export class PostInteractionsStoreService {
  public _comments = signal<Coment[]>([]);

  constructor() {
      const stored = localStorage.getItem('articles');
      const parsed: Coment[] = stored ? JSON.parse(stored) : [];
      this._comments.set(Array.isArray(parsed) ? parsed : []);
  
      effect(() => {
        const articles = this._comments();
        localStorage.setItem('articles', JSON.stringify(articles));
      });
    }

  saveComments(comments: Coment[]): void {
      const currentComments = this._comments();
      this._comments.set([...currentComments])
    }
}