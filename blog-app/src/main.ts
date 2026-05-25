import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { authInterceptor } from './app/services/auth/auth-interceptor';
import { AUTH_SERVICE } from './app/services/auth/auth-service.token';
import { environment } from './environments/environment';
import { LocalStorageAuthService } from './app/services/auth/auth-lc-service';
import { AuthService } from './app/services/auth/auth-service';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient(withInterceptors([authInterceptor])),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: '/graphql',
        }),
        cache: new InMemoryCache(),
      };
    }),
  ],
}).catch((err) => console.error(err));
