import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { ProgressBarComponent } from './ProgressBar.component';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule
	],
	declarations: [
		ProgressBarComponent
	],
	exports:[ProgressBarComponent]
})
export class ProgressBarModule { }
