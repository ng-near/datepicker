import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

import { AppModuleNgFactory } from '../build/aot/src/app/app.module.ngfactory';

import './style.scss';

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
