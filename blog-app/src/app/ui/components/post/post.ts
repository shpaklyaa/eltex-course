import { Component, Input, Output, HostBinding, EventEmitter, input } from '@angular/core';
import { Article } from '../../../types/article';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  @Input() article!: Article;
  @Input() isFirst = false;

  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Article>();

  @HostBinding('attr.is-first') get isFirstChild() {
    return this.isFirst ? 'true' : null;
  }

  protected onDelete() {
    this.delete.emit(this.article.id);
  }

  protected onEdit() {
    this.edit.emit(this.article);
  }
}