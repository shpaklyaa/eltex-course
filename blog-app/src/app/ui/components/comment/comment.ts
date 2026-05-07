import { Component, Input } from '@angular/core';
import { Coment } from '../../../types/coment';

@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class Comment {
  @Input() comment!: Coment;
}
