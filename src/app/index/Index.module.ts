import { NgModule } from '@angular/core';

import { IndexGeneratorService } from './IndexGenerator.service';

export * from './IndexGenerator.service';

@NgModule({
	imports: [],
	declarations: [
	],
	providers:[
		IndexGeneratorService
	],
	exports:[

	]
})
export class IndexModule {}
