import { Injectable, signal, effect, computed} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article } from '../../types/article';
import { ArticlesStoreService } from './articles-store.service';

@Injectable()
export class ArticlesServiceImpl {
  private allArticles = signal<Article[]>([]);

  readonly _allArticles = computed(() => this.allArticles());
  readonly totalCount = computed(() => this.allArticles().length);

  constructor(private store: ArticlesStoreService) {
    console.log('[LOCAL] ArticlesServiceImpl instantiated');
    const stored = localStorage.getItem('articles');
    if (stored) {
      this.allArticles.set(JSON.parse(stored));
    }

    effect(() => {
      const articles = this._allArticles();
      localStorage.setItem('articles', JSON.stringify(articles));
    });
  }

  getAll(page: number = 1, limit: number = 7): Observable<{ articles: Article[]; total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const articles = this.allArticles().slice(start, end);
    this.store.updatePageData(articles, this.allArticles().length);
    return of({ articles, total: this.allArticles().length });
  }

  getById(id: string): Observable<Article | undefined> {
    const article = this.allArticles().find(a => a.id === id);
    return of(article);
  }

  create(articleData: Omit<Article, 'id'>): Observable<Article> {
    const newId = crypto.randomUUID();
    const newArticle: Article = { id: newId, ...articleData };
    localStorage.setItem('articles', JSON.stringify(this.allArticles));
    this.allArticles.update(articles => [...articles, newArticle]);
    this.store.updatePageData(this.allArticles(), this.allArticles().length)
    return of(newArticle);
  }

  update(updatedArticle: Article): Observable<Article> {
    this.allArticles.update(articles => {
      const index = articles.findIndex(a => a.id === updatedArticle.id);
      if (index === -1) {
        throw new Error(`Article with id ${updatedArticle.id} not found`);
      }
      const updatedArticles = [...articles];
      updatedArticles[index] = updatedArticle;
      return updatedArticles;
    });
    return of(updatedArticle);
  }

  delete(id: string): Observable<void> {
    this.allArticles.update(articles => {
      const index = articles.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error(`Article with id ${id} not found`);
      }
      const updatedArticles = [...articles];
      updatedArticles.splice(index, 1);
      return updatedArticles;
    });
    return of(undefined);
  }

  getTotalCount(): Observable<number> {
    return of(this.allArticles.length);
  }
}