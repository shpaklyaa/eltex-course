import { Component, ViewChild, OnInit, Inject, signal, computed, DestroyRef, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterOutlet, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { Post } from '../../components/post/post';
import { Article } from '../../.././types/article';
import { FormModal } from '../../components/form-modal/form-modal';
import { StatsModal } from '../../components/stats-modal/stats-modal';
import { IArticlesService } from '../../../services/articles/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ArticlesServiceImpl } from '../../../services/articles/articles.service';
import { ARTICLES_SERVICE } from '../../../services/articles/articles-service.token';
import { PostInteractionsStoreService } from '../../../services/comments/post-interactions-store.service';
import { PostInteractionsServiceImpl } from '../../../services/comments/post-interactions.service';
import { IPostInteractionsService } from '../../../services/comments/post-interactions.interface';
import { POST_INTERACTIONS_SERVICE } from '../../../services/comments/post-interactions.token';
import { LoginModal } from '../../components/login-modal/login-modal';
import { MatDialog } from '@angular/material/dialog'
import { MatDialogRef } from '@angular/material/dialog'; 
import { AuthService } from '../../../services/auth/auth-service';
import { HasRoleDirective } from '../../../directives/has-role.directive';
import { environment } from '../../../../environments/environment';
import { GqlService } from '../../../services/comments/graphql.service';

@Component({
  selector: 'app-blog',
  imports: [
    Post,
    AdminPanel,
    CommonModule,
    FormModal,
    StatsModal,
    HasRoleDirective
  ],
  providers: [
    { provide: POST_INTERACTIONS_SERVICE, useClass: environment.useLcService ? PostInteractionsServiceImpl : GqlService }
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  public isArticleModalOpen = signal(false);
  public isStatsModalOpen = signal(false);

  editingArticle: Article | undefined = undefined;

  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: IArticlesService,
    private store: ArticlesStoreService,
    private comsStore: PostInteractionsStoreService,
    private destroyRef: DestroyRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadArticlesForPage(1);
      console.log('Initial state:', {
    totalArticles: this.store._totalArticles(),
    pageSize: this.store.pageSize(),
    totalPages: this.store.totalPages()
  });
  }

  readonly paginatedArticles = computed(() => {
    return this.store.currentPageArticles();
  });

  readonly currentPage = computed(() => {
    return this.store.totalPages();
  });

  public getArticleById(articleId: string): void {
    this.articlesService.getById(articleId).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          console.log('получен id', articleId);
        }
    });
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

  public saveArticle(articleData: Partial<Article>): void {
    if ('id' in articleData && articleData.id != null) {
      const fullArticle: Article = {
        id: articleData.id!,
        title: articleData.title ?? '',
        content: articleData.content ?? '',
        image: articleData.image,
      };
      this.articlesService.update(fullArticle).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          console.log('Статья обновлена', fullArticle);
          this.loadArticlesForPage(this.store.currentPage());
          this.closeModal();
        }
      });
    } else {
      const newArticle = {
        title: articleData.title ?? '',
        content: articleData.content ?? '',
        image: articleData.image,
      };
      this.articlesService.create(newArticle).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          console.log('Статья добавлена', newArticle);
          this.loadArticlesForPage(this.store.currentPage());
          this.closeModal();
        },
      });
    }
  }

  public deleteArticle(id: string): void {
    this.articlesService.delete(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      console.log('Статья удалена:', id);
      this.loadArticlesForPage(this.store.currentPage());
    });
  }

  public closeModal(): void {
    this.isStatsModalOpen.set(false);
    this.isArticleModalOpen.set(false);
  }

  public openModalForm(article?: Article): void {
    this.isArticleModalOpen.set(true);
    this.editingArticle = article;
  }

  public openModalStats(): void {
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