import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// "server": "src/main.server.ts",
            // "outputMode": "server",
            // "security": {
            //   "allowedHosts": []
            // },
            // "ssr": {
            //   "entry": "src/server.ts"
            // }
