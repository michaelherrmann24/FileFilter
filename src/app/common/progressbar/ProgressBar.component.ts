import {Component,Input} from '@angular/core';

@Component({
	selector: 'progress-bar',
	template: `
		<div class="meter">
			<div class="bar" [style.width]="widthValue"></div>
			<div class="content"><ng-content></ng-content></div>
		</div>`,
	styleUrls:['./Progressbar.component.css']
})
export class ProgressBarComponent{

	@Input('progress')_progress:number = 0;

	get widthValue(){
		return (this.progress)?`${this.progress}%`:"0%";
	}
	get progress(){
		if(isNaN(this._progress)){
			return 0;
		}
		return this._progress;
	}
	set progress(progress:number){
		this._progress = progress;
	}
}



