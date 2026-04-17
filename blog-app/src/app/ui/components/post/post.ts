import { Component, Input, Output, HostBinding, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  @Input() title!: string;
  @Input() content!: string;
  @Input() id!: number
  @Input() isFirst: boolean = false;

  @Output() delete = new EventEmitter<number>();

  @HostBinding('attr.is-first') get isFirstChild() {
    return this.isFirst ? 'true' : null;
  }

  onDelete() {
    console.log('[Post] Delete button clicked for id:', this.id);
    this.delete.emit(this.id);
  }
}