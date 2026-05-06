import { Component, signal, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./ui/components/header/header";
import { Footer } from "./ui/components/footer/footer";
import { ArticlesService } from './services/articles/articles-service.interface';
import { ArticlesStoreService } from './services/articles/articles-store.service';
import { ArticlesServiceImpl } from './services/articles/articles.service';
import { ARTICLES_SERVICE } from './services/articles/articles-service.token';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [
    { provide: ARTICLES_SERVICE, useClass: ArticlesServiceImpl }
  ]
})
export class App {
  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: ArticlesService,
    private store: ArticlesStoreService
  ) {}
  protected readonly title = signal('blog-app');
}
