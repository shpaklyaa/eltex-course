import { Observable } from 'rxjs';
import { Coment } from '../../types/coment';

export interface PostInteractionsService {
  // getCommentsForArticle(articleId: string): Observable<Coment[]>;
  getById(id: string): Observable<Coment | undefined>;
  create(comment: Omit<Coment, 'id' | 'articleId'>): Observable<Coment>;
  update(comment: Coment): Observable<Coment>;
  delete(id: string,  articleId: string): Observable<void>;
}