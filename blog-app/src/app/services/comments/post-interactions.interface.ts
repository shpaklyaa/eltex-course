import { Observable } from 'rxjs';
import { Coment } from '../../types/coment';
import { Article } from '../../types/article';

export interface IPostInteractionsService {
  getCommentsForArticle(articleId: string): Observable<Coment[]>;
  getById(id: string): Observable<Coment[] | undefined>;
  create(comment: Omit<Coment, 'id' | 'articleId'>): Observable<Coment>;
  update(comment: Coment): Observable<Coment>;
  delete(id: string,  articleId: string): Observable<void>;
  updateCommentRatingUp(commentId: string): Observable<Coment>;
  updateCommentRatingDown(commentId: string): Observable<Coment>;
  updateArticleRatingUp(articleId: string): Observable<Article>;
  updateArticleRatingDown(articleId: string): Observable<Article>;
}