import { Component } from '@angular/core';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { Post } from '../../components/post/post';

@Component({
  selector: 'app-blog',
  imports: [
    Post,
    AdminPanel
  ],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  articles = [
    { id: 0, title: 'Angular Basics', content: 'Learn the fundamentals of Angular.' },
    { id: 1, title: 'Angular Basics', content: 'Learn the fundamentals of Angular.' },
    { id: 2, title: 'Routing in Angular', content: 'Master navigation with Angular Router.' },
    { id: 3, title: 'Styling Components', content: 'Style your components effectively.' },
    { id: 4, title: 'Angular Basics', content: 'Learn the fundamentals of Angular.' },
    { id: 5, title: 'Routing in Angular', content: 'Master navigation with Angular Router.' },
    { id: 6, title: 'Styling Components', content: 'Style your components effectively.' }
  ]
}
