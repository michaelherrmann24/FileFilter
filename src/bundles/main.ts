import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { FileFilterModule } from '../app/FileFilter.module';

import { Trace } from '../app/common/Common.module';

if (process.env.ENV === 'production') {
	enableProdMode();
}

(<any>window).trace = new Trace();

platformBrowserDynamic().bootstrapModule(FileFilterModule);


