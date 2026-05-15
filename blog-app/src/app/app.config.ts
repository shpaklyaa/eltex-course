import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { ArticlesServiceImpl } from './services/articles/articles.service';
import { HttpArticleServiceImpl } from './services/articles/http.articles.service';
import { ENV_CONFIG } from './tokens/env.token';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ARTICLES_SERVICE } from './services/articles/articles-service.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),

    { provide: ENV_CONFIG, useValue: environment },

    { 
      provide: ARTICLES_SERVICE, 
      useClass: HttpArticleServiceImpl
      // useClass: ArticlesServiceImpl
      // useClass: environment.useLcService ? ArticlesServiceImpl : HttpArticleServiceImpl
    }
  ]
};
