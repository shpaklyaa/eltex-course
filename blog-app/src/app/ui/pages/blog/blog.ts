import { Component, ViewChild, OnInit, Inject, signal, computed, DestroyRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { Post } from '../../components/post/post';
import { Article } from '../../.././types/article';
import { FormModal } from '../../components/form-modal/form-modal';
import { StatsModal } from '../../components/stats-modal/stats-modal';
import { ArticlesService } from '../../../services/articles/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ArticlesServiceImpl } from '../../../services/articles/articles.service';
import { ARTICLES_SERVICE } from '../../../services/articles/articles-service.token';
import { PostInteractionsStoreService } from '../../../services/comments/post-interactions-store.service';
import { PostInteractionsServiceImpl } from '../../../services/comments/post-interactions.service';
import { PostInteractionsService } from '../../../services/comments/post-interactions.interface';
import { POST_INTERACTIONS_SERVICE } from '../../../services/comments/post-interactions.token';

@Component({
  selector: 'app-blog',
  imports: [
    Post,
    AdminPanel,
    CommonModule,
    FormModal,
    StatsModal
  ],
  providers: [
    { provide: ARTICLES_SERVICE, useClass: ArticlesServiceImpl },
    { provide: POST_INTERACTIONS_SERVICE, useClass: PostInteractionsServiceImpl }
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  protected isArticleModalOpen = signal(false);
  protected isStatsModalOpen = signal(false);

  editingArticle: Article | undefined = undefined;

  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: ArticlesService,
    private store: ArticlesStoreService,
    private comsStore: PostInteractionsStoreService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArticlesForPage(1);
  }

  private loadArticlesForPage(page: number): void {
    const size = this.store.pageSize();
    this.articlesService.getAll(page, size).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ articles, total }) => {
      this.store.updatePageData(articles, total);
    });
  }

  public onPostClick(article: Article): void {
    this.router.navigate(['/blog', 'post', article.id]);
  }

  protected isFirstOnPage(article: Article): boolean {
    const paginatedArticles = this.store.currentPageArticles();
    return paginatedArticles.length > 0 && paginatedArticles[0].id === article.id;
  }

  public get statsData() {
    return { totalArticles: this.store._totalArticles() };
  }

  readonly paginatedArticles = computed(() => {
    return this.store.currentPageArticles();
  });

  protected get currentPage(): number {
    return this.store.currentPage();
  }

  protected get pageNumbers(): number[] {
    const totPages = this.totalPages;
    return Array.from({ length: totPages }, (_, i) => i + 1);
  }

  public get totalPages(): number {
    return this.store.totalPages();
  }

  protected goToPage(page: number): void {
    this.store.currenPage = page;
    this.loadArticlesForPage(page);
  }

  protected saveArticle(articleData: Partial<Article>): void {
    if ('id' in articleData && articleData.id != null) {
      const fullArticle: Article = {
        id: articleData.id!,
        title: articleData.title ?? '',
        content: articleData.content ?? ''
      };
      this.articlesService.update(fullArticle).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          console.log('Статья обновлена');
          this.loadArticlesForPage(this.store.currentPage());
          this.closeModal();
        }
      });
    } else {
      const newArticle = {
        title: articleData.title ?? '',
        content: articleData.content ?? ''
      };
      this.articlesService.create(newArticle).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          console.log('Статья добавлена');
          this.loadArticlesForPage(this.store.currentPage());
          this.closeModal();
        },
      });
    }
  }

  protected deleteArticle(id: string): void {
    this.articlesService.delete(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      console.log('Статья удалена:', id);
      this.loadArticlesForPage(this.store.currentPage());
    });
  }

  protected closeModal(): void {
    this.isStatsModalOpen.set(false);
    this.isArticleModalOpen.set(false);
  }

  protected openModalForm(article?: Article): void {
    this.isArticleModalOpen.set(true);
    this.editingArticle = article;
  }

  protected openModalStats(): void {
    this.isStatsModalOpen.set(true);
  }

  readonly paginatedArticlesWithRating = computed(() => {
    const articles = this.store.currentPageArticles();
    const ratingMap = this.comsStore.ratingStats();

    return articles.map(article => {
      const stats = ratingMap.get(article.id) || { average: 0, count: 0 };
      return {
        ...article,
        averageRating: stats.average,
        ratingCount: stats.count,
      };
    });
  });
}