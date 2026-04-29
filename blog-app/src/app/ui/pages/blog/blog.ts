import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { EditFormModal } from '../../components/edit-form-modal/edit-form-modal';
import { Post } from '../../components/post/post';
import { Article } from '../../.././types/article';
import { FormModal } from '../../components/form-modal/form-modal';
import { StatsModal } from '../../components/stats-modal/stats-modal';
import { ArticlesService } from '../../../services/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles-store.service';
import { ArticlesServiceImpl } from '../../../services/articles.service';
import { ARTICLES_SERVICE } from '../../../services/articles-service.token';

@Component({
  selector: 'app-blog',
  imports: [
    Post,
    AdminPanel,
    EditFormModal,
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
  @ViewChild(EditFormModal) modalEdit!: EditFormModal;
  @ViewChild(EditFormModal) modalBackdropEdit!: EditFormModal;
  @ViewChild(FormModal) modal!: FormModal;
  @ViewChild(FormModal) modalBackdrop!: FormModal;
  @ViewChild(StatsModal) modalStats!: StatsModal;
  @ViewChild(StatsModal) modalBackdropStats!: StatsModal;

  isEditModalOpen = false;
  isAddModalOpen = false;
  isStatsModalOpen = false;

  editingArticle: Article | undefined = undefined;

  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: ArticlesService,
    private store: ArticlesStoreService
  ) {}

  ngOnInit() {
    if (this.store.articles.length === 0) {
      this.articlesService.getAll().subscribe(articles => {
      });
    }
  }

  isFirstOnPage(article: Article): boolean {
    const paginatedArticles = this.store.getPaginatedArticles();
    return paginatedArticles.length > 0 && paginatedArticles[0].id === article.id;
  }

  get statsData() {
    return { totalArticles: this.store.articles.length }
  }

  get paginatedArticles() {
    return this.store.getPaginatedArticles();
  }

  get currentPage() {
    return this.store.currentPage;
  }

  get pageNumbers(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

  get totalPages() {
    return this.store.totalPages;
  }

  goToPage(page: number): void {
    this.store.currentPage = page;
  }

  createArticle(article: Article): void {
    this.articlesService.create(article).subscribe(newArticle => {
      console.log('Статья добавлена:', newArticle);
      this.closeModal();
    });
  }

  saveArticle(articleData: Partial<Article>): void {
    if ('id' in articleData && articleData.id != null) {
      const fullArticle: Article = {
        id: articleData.id!,
        title: articleData.title ?? '',
        content: articleData.content ?? ''
      };
      this.articlesService.update(fullArticle).subscribe({
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
      this.articlesService.create(newArticle).subscribe({
        next: () => {
          console.log('Создано');
          this.closeModal();
        },
        });
      }
  }

  deleteArticle(id: number): void {
    this.articlesService.delete(id).subscribe(() => {
      console.log('Удалено:', id);
    });
  }

  closeModal(): void {
    this.isEditModalOpen = false;
    this.isAddModalOpen = false;
    this.isStatsModalOpen = false;
  }

  openModalForm() {
    this.isAddModalOpen = true;
  }

  openEditModal(article: Article): void {
    this.editingArticle = article;
    this.isEditModalOpen = true;
  }

  openModalStats() {
    this.isStatsModalOpen = true;
  }
}