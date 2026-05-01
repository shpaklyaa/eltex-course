import { Component, Input } from '@angular/core';
import { Article } from '../../../types/article';

@Component({
  selector: 'app-posts-home',
  imports: [],
  templateUrl: './posts-home.html',
  styleUrl: './posts-home.scss',
})
export class PostsHome {
  @Input() article!: Article;
  @Input() isFirst = false;
}
