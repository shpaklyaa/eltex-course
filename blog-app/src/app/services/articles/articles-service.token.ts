import { InjectionToken } from '@angular/core';
import { ArticlesService } from './articles-service.interface';

export const ARTICLES_SERVICE = new InjectionToken<ArticlesService>('ArticlesService');