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
  @Output() select = new EventEmitter<Article>();

  @HostBinding('attr.is-first') get isFirstChild() {
    return this.isFirst ? 'true' : null;
  }

  ngOnInit() {
    console.log('Article:', this.article);
  }

  protected onDelete() {
    this.delete.emit(this.article.id);
  }

  protected onEdit() {
    this.edit.emit(this.article);
  }

  protected onSelect() {
    this.select.emit(this.article);
  }
}