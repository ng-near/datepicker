import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import './style.scss';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
