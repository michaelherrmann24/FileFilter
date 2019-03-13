import {
	Component,
	Input,
	ElementRef,
	SimpleChanges,
	OnChanges
} from '@angular/core';

import {EntryExitLogger} from '../decorators/EntryExit.decorator';
import {Loggable} from '../decorators/Loggable.decorator';

import '../../../svg-sprite.svg';

@Loggable("app.common.svg")
@Component({
	selector: 'svg[use]',
	template: `<svg:use [attr.xlink:href]="iconUri" />`,
	styleUrls: ['./SvgSprite.component.css']
})
export class SvgSpriteComponent implements OnChanges {

	private iconUri:string;

	@Input()use:any;

	private static SPRITE_LINK:string = '/assets/svg-sprite.svg';

	constructor(private el: ElementRef) {}

	@EntryExitLogger
	ngOnChanges(changes: SimpleChanges) {
		if(typeof this.use !== 'undefined'){
			this.iconUri = `#${this.use}`;
			this.el.nativeElement.classList.add('icon');
			this.el.nativeElement.classList.add(`icon-${this.use}`);
		}

	}

}
