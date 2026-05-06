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
    { provide: ARTICLES_SERVICE, useClass: ArticlesServiceImpl }
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  @ViewChild(FormModal) modal!: FormModal;
  @ViewChild(FormModal) modalBackdrop!: FormModal;
  @ViewChild(StatsModal) modalStats!: StatsModal;
  @ViewChild(StatsModal) modalBackdropStats!: StatsModal;

  protected isArticleModalOpen = signal(false);
  protected isStatsModalOpen = signal(false);

  editingArticle: Article | undefined = undefined;

  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: ArticlesService,
    private store: ArticlesStoreService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.store.arts().length === 0) {
      this.articlesService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe(articles => {
      });
    }
    console.log('paginatedArticles():', this.paginatedArticles());
    console.log('Type:', Array.isArray(this.paginatedArticles()));
  }

  public onPostClick(article: Article): void {
    this.router.navigate(['/blog', 'post', article.id]);
  }

  protected isFirstOnPage(article: Article): boolean {
    const paginatedArticles = this.store.getPaginatedArticles();
    return paginatedArticles.length > 0 && paginatedArticles[0].id === article.id;
  }

  public get statsData() {
    return { totalArticles: this.store.arts().length }
  }

  readonly paginatedArticles = computed(() => {
    return this.store.currentPageArticles();
  });

  protected get currentPage() {
    return this.store.currentPage;
  }

  protected get pageNumbers(): number[] {
    const totPages = this.totalPages();
    return Array.from({ length: totPages }, (_, i) => i + 1);
  }

  public get totalPages() {
    return this.store.totalPages;
  }

  protected goToPage(page: number): void {
    this.store.currentPage = page;
  }

  protected saveArticle(articleData: Partial<Article>): void {
    if ('id' in articleData && articleData.id != null) {
      const fullArticle: Article = {
        id: articleData.id!,
        title: articleData.title ?? '',
        content: articleData.content ?? ''
      };
      this.articlesService.update(fullArticle).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          console.log('Обновлено');
          this.closeModal();
        }
      });
    } else {
      const newArticle = {
        title: articleData.title ?? '',
        content: articleData.content ?? ''
      };
      this.articlesService.create(newArticle).pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          console.log('Статья добавлена:');
          this.closeModal();
        },
      });
    }
  }

  protected deleteArticle(id: string): void {
    this.articlesService.delete(id).pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      console.log('Удалено:', id);
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

  protected openModalStats() {
    this.isStatsModalOpen.set(true);
  }
}