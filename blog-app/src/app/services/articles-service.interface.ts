import { Observable } from 'rxjs';
import { Article } from '../types/article';

export interface ArticlesService {
  getAll(): Observable<Article[]>;
  getById(id: number): Observable<Article | undefined>;
  create(article: Omit<Article, 'id'>): Observable<Article>;
  update(article: Article): Observable<Article>;
  delete(id: number): Observable<void>;
  getTotalCount(): Observable<number>;
}