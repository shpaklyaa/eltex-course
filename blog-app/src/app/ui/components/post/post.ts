import { Component, Input, Output, HostBinding, EventEmitter } from '@angular/core';
import { Article } from '../../../types/article';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  @Input() article!: Article;

  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Article>();

  // @HostBinding('attr.is-first') get isFirstChild() {
  //   return this.isFirst ? 'true' : null;
  // }

  onDelete() {
    this.delete.emit(this.article.id);
  }

  onEdit() {
    this.edit.emit(this.article);
  }
}