import { Injectable, signal, computed, effect } from '@angular/core';
import { Coment } from '../../types/coment';

@Injectable({
  providedIn: 'root'
})
export class PostInteractionsStoreService {
  public _comments = signal<Coment[]>([]);

  constructor() {
    const stored = localStorage.getItem('comments');
    const parsed: Coment[] = stored ? JSON.parse(stored) : [];
    this._comments.set(Array.isArray(parsed) ? parsed : []);

    effect(() => {
      const comments = this._comments();
      localStorage.setItem('comments', JSON.stringify(comments));
    });
  }

  saveComments(comments: Coment[]): void {
    const currentComments = this._comments();
    this._comments.set([...currentComments])
  }
  
  readonly ratingStats = computed(() => {
    const comments = this._comments();
    const stats = new Map<string, { total: number; count: number }>();

    for (const comment of comments) {
      if (comment.rating == null) continue;

      const id = comment.articleId;
      if (!stats.has(id)) {
        stats.set(id, { total: 0, count: 0 });
      }

      const stat = stats.get(id)!;
      stat.total += comment.rating;
      stat.count += 1;
    }

    const result = new Map<string, { average: number; count: number }>();
    for (const [id, { total, count }] of stats) {
      result.set(id, {
        average: Number((total / count).toFixed(1)),
        count,
      });
    }

    return result;
  });

  getRatingForArticle(articleId: string): { average: number; count: number } {
    return this.ratingStats().get(articleId) || { average: 0, count: 0 };
  }
}