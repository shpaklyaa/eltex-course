import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { ArticlesServiceImpl } from './services/articles/articles.service';
import { HttpArticleServiceImpl } from './services/articles/http.articles.service';
import { ENV_CONFIG } from './tokens/env.token';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ARTICLES_SERVICE } from './services/articles/articles-service.token';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { AUTH_SERVICE } from './services/auth/auth-service.token';
import { LocalStorageAuthService } from './services/auth/auth-lc-service';
import { AuthService } from './services/auth/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),

    { provide: ENV_CONFIG, useValue: environment },

    { 
      provide: ARTICLES_SERVICE, 
      // useClass: ArticlesServiceImpl
      useClass: environment.useLcService ? ArticlesServiceImpl : HttpArticleServiceImpl
    },
    { 
      provide: AUTH_SERVICE, 
      // useClass: LocalStorageAuthService
      useClass: environment.useLcService ? LocalStorageAuthService : AuthService
    }
  ]
};
