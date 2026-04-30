import { Component, OnInit, Inject } from '@angular/core';
import { About } from "../../components/about/about";
import { PostsHome } from '../../components/posts-home/posts-home';
import { Skills } from '../../components/skills/skills';
import { Work } from '../../components/work/work';
import { Hobby } from '../../components/hobby/hobby';
import { ArticlesService } from '../../../services/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles-store.service';
import { ArticlesServiceImpl } from '../../../services/articles.service';
import { ARTICLES_SERVICE } from '../../../services/articles-service.token';
import { Article } from '../../.././types/article';

@Component({
  selector: 'app-home',
  imports: [
    About,
    PostsHome,
    Skills,
    Work,
    Hobby
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  providers: [
      { provide: ARTICLES_SERVICE, useClass: ArticlesServiceImpl }
  ]
})
export class Home implements OnInit {

  protected filteredArts: Article[] = [];

  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: ArticlesService,
    private store: ArticlesStoreService
  ) {}

  ngOnInit() {
    if (this.store.articles.length === 0) {
      this.articlesService.getAll().subscribe(articles => {
      });
    }
  }

  get lastestTwo() {
    return this.store.latestTwoArticles;
  }

  protected isFirst(article: Article): boolean {
    const latestTwoArticles = this.store.latestTwoArticles;
    return latestTwoArticles[0].id === article.id;
  }
}

