import { Observable } from 'rxjs';
import { Article } from '../../types/article';
import { ArtsResponse } from '../../types/artsResponse';

export interface ArticlesService {
  getAll(page?: number, limit?: number): Observable<ArtsResponse<Article>>;
  getById(id: string): Observable<Article | undefined>;
  create(article: Omit<Article, 'id'>): Observable<Article>;
  update(article: Article): Observable<Article>;
  delete(id: string): Observable<void>;
  getTotalCount(): Observable<number>;
}