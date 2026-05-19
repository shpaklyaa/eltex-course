import { Component, signal, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./ui/components/header/header";
import { Footer } from "./ui/components/footer/footer";
import { IArticlesService } from './services/articles/articles-service.interface';
import { ArticlesStoreService } from './services/articles/articles-store.service';
import { ArticlesServiceImpl } from './services/articles/articles.service';
import { ARTICLES_SERVICE } from './services/articles/articles-service.token';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [
  ]
})
export class App {
  constructor(
    private store: ArticlesStoreService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}
  protected readonly title = signal('blog-app');

  ngOnInit(): void {
    this.matIconRegistry.addSvgIcon(
      'save',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/save.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'exit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/exit.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'cross',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/cross.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/pencil2.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'person',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/personlogo.svg')
    );
  }
}
