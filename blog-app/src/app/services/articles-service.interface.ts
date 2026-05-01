import { Observable } from 'rxjs';
import { Article } from '../types/article';

export interface ArticlesService {
  getAll(): Observable<Article[]>;
  getById(id: string): Observable<Article | undefined>;
  create(article: Omit<Article, 'id'>): Observable<Article>;
  update(article: Article): Observable<Article>;
  delete(id: string): Observable<void>;
  getTotalCount(): Observable<number>;
}