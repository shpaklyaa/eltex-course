import { Injectable, signal, computed, effect } from '@angular/core';
import { Coment } from '../../types/coment';

@Injectable({
  providedIn: 'root'
})
export class PostInteractionsStoreService {
  public _comments = signal<Coment[]>([]);

  saveComments(comments: Coment[]): void {
      const currentComments = this._comments();
      this._comments.set([...currentComments])
    }
}