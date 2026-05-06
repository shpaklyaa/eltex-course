import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../../../services/articles/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ArticlesServiceImpl } from '../../../services/articles/articles.service';
import { ARTICLES_SERVICE } from '../../../services/articles/articles-service.token';
import { Article } from '../../.././types/article';
import { CommentsForm } from "../../components/comments-form/comments-form";

@Component({
  selector: 'app-post-page',
  imports: [CommentsForm],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
  providers: [
    { provide: ARTICLES_SERVICE, useClass: ArticlesServiceImpl }
  ],
})
export class PostPage {
  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private store: ArticlesStoreService
  ) {}

  article?: Article;

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id') || '';
    this.articlesService.getById(postId).subscribe((data) => {
      this.article = data;
    })
  }
}
