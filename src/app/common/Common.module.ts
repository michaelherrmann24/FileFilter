import { NgModule } from '@angular/core';
import { SessionStorage } from "./utils/storage/SessionStorage";
import { LocalStorage } from "./utils/storage/LocalStorage";

import { SvgSpriteComponent } from "./svg/SvgSprite.component";
import { SvgSpriteIncludeComponent} from "./svg/SvgSpriteInclude.component";

import { ProgressBarComponent } from "./progressbar/ProgressBar.component";

import { FileSystemModule } from "./utils/filesystem/FileSystem.module";

export * from "./decorators/EntryExit.decorator";
export * from "./decorators/Loggable.decorator";

export * from "./utils/Trace";
export * from "./utils/Logger";
export * from "./utils/storage/AbstractStorage";
export * from "./utils/storage/SessionStorage";
export * from "./utils/storage/LocalStorage";
export * from "./utils/StringBuffer";
export * from "./svg/SvgSprite.component";
export * from "./svg/SvgSpriteInclude.component";

export * from "./utils/filesystem/FileSystem.module";

@NgModule({
	imports:[FileSystemModule],
	declarations: [
		SvgSpriteComponent,
		SvgSpriteIncludeComponent,
		ProgressBarComponent
	],
	providers:[
		LocalStorage,
		SessionStorage
	],
	exports:[
		SvgSpriteComponent,
		SvgSpriteIncludeComponent,
		ProgressBarComponent
	]
})
export class CommonModule {};
