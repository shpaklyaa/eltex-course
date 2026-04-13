import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Header } from './app/ui/components/header/header';
import { Footer } from './app/ui/components/footer/footer';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

bootstrapApplication(Header, appConfig).catch((err) => console.error(err));

bootstrapApplication(Footer, appConfig).catch((err) => console.error(err));
