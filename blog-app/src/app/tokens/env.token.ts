import { InjectionToken } from '@angular/core';
import { AppEnvironment } from '../../environments/environment.interface';

export const ENV_CONFIG = new InjectionToken<AppEnvironment>('ENV_CONFIG');