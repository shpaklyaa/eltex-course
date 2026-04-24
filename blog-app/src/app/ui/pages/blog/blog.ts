import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { EditFormModal } from '../../components/edit-form-modal/edit-form-modal';
import { Post } from '../../components/post/post';
import { Article } from '../../.././types/article';
import { FormModal } from '../../components/form-modal/form-modal';
import { StatsModal } from '../../components/stats-modal/stats-modal';

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
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  @ViewChild(EditFormModal) modalEdit!: EditFormModal;
  @ViewChild(EditFormModal) modalBackdropEdit!: EditFormModal;
  @ViewChild(FormModal) modal!: FormModal;
  @ViewChild(FormModal) modalBackdrop!: FormModal;
  @ViewChild(StatsModal) modalStats!: StatsModal;
  @ViewChild(StatsModal) modalBackdropStats!: StatsModal;

  isEditModalOpen = false;
  isAddModalOpen = false;
  isStatsModalOpen = false;

  articles: Article[] = [
    { id: 0, title: 'Angular Basics', content: 'Learn the fundamentals of Angular.' },
    { id: 1, title: 'Angular Basics', content: 'Learn the fundamentals of Angular.' },
    { id: 2, title: 'Routing in Angular', content: 'Master navigation with Angular Router.' },
    { id: 3, title: 'Styling Components', content: 'Style your components effectively.' },
    { id: 4, title: 'Angular Basics', content: 'Learn the fundamentals of Angular.' },
    { id: 5, title: 'Routing in Angular', content: 'Master navigation with Angular Router.' },
    { id: 6, title: 'Styling Components', content: 'Style your components effectively.' }
  ]

  editingArticle: Article | undefined = undefined;

  get articlesCount(): number {
    return this.articles.length;
  }

  deleteArticle(id: number) {
    this.articles = this.articles.filter(article => article.id !== id);
  }

  editArticle(id: number) {
    console.log(`[Blog] Editing article with id: ${id}`);
    this.editingArticle = this.articles.find(article => article.id === id);
    this.isEditModalOpen = true;
  }

  onSaveArticle(updatedArticle: Article) {
    const index = this.articles.findIndex(article => article.id === updatedArticle.id);
    if (this.editingArticle) {
      if (index !== -1) {
        this.articles[index] = updatedArticle;
      }
    } else {
        const newArticle = { ...updatedArticle, id: this.articles.length};
        this.articles.push(newArticle);
      }
    this.closeModal();
  }

  closeModal(): void {
    this.editingArticle = undefined;
    this.isEditModalOpen = false;
    this.isAddModalOpen = false;
    this.isStatsModalOpen = false;
  }

  openModalForm() {
    this.isAddModalOpen = true;
  }

  openModalStats() {
    this.isStatsModalOpen = true;
  }
}