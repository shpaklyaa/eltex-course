import { InjectionToken } from '@angular/core';
import { PostInteractionsService } from './post-interactions.interface';

export const POST_INTERACTIONS_SERVICE = new InjectionToken<PostInteractionsService>('PostInteractionsService');