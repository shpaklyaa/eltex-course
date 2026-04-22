import { Component, Input } from '@angular/core';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { EditFormModal } from '../../components/edit-form-modal/edit-form-modal';
import { Post } from '../../components/post/post';
import { Article } from '../../.././types/article';

@Component({
  selector: 'app-blog',
  imports: [
    Post,
    AdminPanel,
    EditFormModal
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
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

  ngOnInit() {
    console.log(this.articlesCount);
  }

  deleteArticle(id: number) {
    console.log('[Blog] Deleting article with id:', id);
    this.articles = this.articles.filter(article => article.id !== id);
  }

  editArticle(id: number) {
    console.log(`[Blog] Editing article with id: ${id}`);
    this.editingArticle = this.articles.find(article => article.id === id);
    // this.articles = this.articles.splice(id, id, editedArticle);
  }

  onSaveArticle(updatedArticle: { id: number; title: string; content: string }) {
    const index = this.articles.findIndex(article => article.id === updatedArticle.id);
    if (index !== -1) {
      this.articles[index] = updatedArticle;
    }
    this.editingArticle = undefined;
  }
}