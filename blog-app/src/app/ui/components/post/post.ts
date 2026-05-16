import { Component, Input, Output, HostBinding, EventEmitter, computed } from '@angular/core';
import { Article } from '../../../types/article';
import { Blog } from '../../pages/blog/blog';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  @Input() article!: Article;
  @Input() isFirst = false;

  @Input() averageRating: number = 0;
  @Input() ratingCount: number = 0;

  @HostBinding('attr.is-first') get isFirstChild() {
    return this.isFirst ? 'true' : null;
  }

  constructor(private blog: Blog) {}

  ngOnInit() {
    console.log('Article:', this.article);
  }

  get ratingDisplay(): string {
    return this.ratingCount > 0
      ? `⭐ ${this.averageRating} (${this.ratingCount})`
      : 'Без оценок';
  }

  protected onDelete() {
    this.blog.deleteArticle(this.article.id);
  }

  protected onEdit() {
    this.blog.openModalForm(this.article);
  }

  protected onSelect() {
    this.blog.onPostClick(this.article)
  }
}