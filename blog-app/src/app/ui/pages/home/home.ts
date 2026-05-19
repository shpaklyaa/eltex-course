import { Component, OnInit, Inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { About } from "../../components/about/about";
import { PostsHome } from '../../components/posts-home/posts-home';
import { Skills } from '../../components/skills/skills';
import { Work } from '../../components/work/work';
import { Hobby } from '../../components/hobby/hobby';
import { IArticlesService } from '../../../services/articles/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ArticlesServiceImpl } from '../../../services/articles/articles.service';
import { ARTICLES_SERVICE } from '../../../services/articles/articles-service.token';
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
})
export class Home implements OnInit {

  protected latestTwoArticles = signal<Article[]>([]);
  private isLoading = signal(true);

  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: IArticlesService,
    private store: ArticlesStoreService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.articlesService.getAll(1, 100).subscribe({
      next: ({ articles }) => {
        const sorted = [...articles].sort((a, b) => b.id.localeCompare(a.id));
        this.latestTwoArticles.set(sorted.slice(0, 2));
      },
      error: () => {
        console.error('Failed to load articles for home page');
        this.latestTwoArticles.set([]);
      }
    });
  }

  get lastestTwo() {
    return this.store.latestTwoArticles;
  }

  protected isFirst(article: Article): boolean {
    const latestTwoArticles = this.store.latestTwoArticles();
    return latestTwoArticles[0].id === article.id;
  }
}

