import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  @Input() title!: string;
  @Input() content!: string;
  @Input() isFirst: boolean = false;

  @HostBinding('attr.is-first') get isFirstChild() {
    return this.isFirst ? 'true' : null;
  }
}