import { Injectable, signal, computed, effect } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, from } from 'rxjs';
import { Coment } from '../../types/coment';
import { PostInteractionsService } from './post-interactions.interface';
import { PostInteractionsStoreService } from './post-interactions-store.service';

function getStoredComments(): Coment[] {
  const data = localStorage.getItem('comments');
  return data ? JSON.parse(data) : [];
}

@Injectable({
  providedIn: 'root',
})
export class PostInteractionsServiceImpl implements PostInteractionsService {
  constructor(private store: PostInteractionsStoreService) {}

  // getCommentsByArticleId(articleId: string): Observable<Coment[]> {
  //   const filteredComments = this.store._comments().filter(a => a.articleId === articleId);
  //   return of(filteredComments);
  // }
  // getCommentsForArticle(articleId: string): Observable<Coment[]> {
  //   const filtered = computed(() => 
  //     this.store._comments().filter(c => c.articleId === articleId)
  //   );
  //   return toObservable(filtered);
  // }
  
  getById(id: string): Observable<Coment | undefined> {
    const comments = getStoredComments();
    const comment = comments.find(a => a.id === id);
    return of(comment);
  }
  
  create(commentData: Omit<Coment, 'id'>): Observable<Coment> {
    const newId = crypto.randomUUID();
    const newComment: Coment = {
        id: newId,
        ...commentData
    };
    this.store._comments.update(comments => [...comments, newComment]);
    return of(newComment);
  }

  update(updatedComment: Coment): Observable<Coment> {
    const currentComments = this.store._comments();
    const exists = currentComments.some(a => a.id === updatedComment.id);

    if (!exists) {
        throw new Error(`Comment with id ${updatedComment.id} not found`);
    }

    const originalComment = currentComments.find((c) => c.id === updatedComment.id);
    if (originalComment?.articleId !== updatedComment.articleId) {
      throw new Error(`Invalid articleId for comment with id ${updatedComment.id}`);
    }

    this.store._comments.update(comments =>
        comments.map(a => a.id === updatedComment.id ? updatedComment : a)
    );
    return of(updatedComment);
  }
  
  delete(id: string, articleId: string): Observable<void> {
    const currentComments = this.store._comments();
    const exists = currentComments.some(a => a.id === id);
    if (!exists) {
        throw new Error(`Comment with id ${id} not found`);
    }

    const commentToDelete = currentComments.find((c) => c.id === id);
    if (commentToDelete?.articleId !== articleId) {
      throw new Error(`Invalid articleId for comment with id ${id}`);
    }

    this.store._comments.update(comments =>
        comments.filter(a => a.id !== id)
    );

    return of(undefined);
  }
}
