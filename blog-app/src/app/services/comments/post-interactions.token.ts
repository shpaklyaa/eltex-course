import { InjectionToken } from '@angular/core';
import { IPostInteractionsService } from './post-interactions.interface';

export const POST_INTERACTIONS_SERVICE = new InjectionToken<IPostInteractionsService>('IPostInteractionsService');