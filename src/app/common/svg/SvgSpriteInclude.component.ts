import {
	Component,
	Input,
	ElementRef,
	SimpleChanges,
	OnChanges,
	OnInit
} from '@angular/core';

import {
	RequestMethod,
	RequestOptions,
	URLSearchParams,
	Request,
	Response,
	Http
} from "@angular/http";

import {EntryExitLogger} from '../decorators/EntryExit.decorator';
import {Loggable} from '../decorators/Loggable.decorator';

import 'rxjs/add/operator/toPromise';
import '../../../svg-sprite.svg';

@Loggable("app.common.svg")
@Component({
	selector: 'svg-include',
	template:'',
	styles:[`:host{display:none;}`]
})
export class SvgSpriteIncludeComponent implements OnChanges {

	@Input()private url:string;
	constructor(private el: ElementRef,private http:Http) {}

	@EntryExitLogger
	ngOnChanges() {
		if(typeof this.url !== 'undefined'){
			this.fetchSVGSprite().then((response:Response)=>{
				this.el.nativeElement.innerHTML = response.text();
			});
		}
	}

	@EntryExitLogger
	fetchSVGSprite():Promise<Response>{

		let requestOptions:RequestOptions = new RequestOptions();
		requestOptions.method = RequestMethod.Get;
		requestOptions.url = this.url;
		let request:Request = new Request(requestOptions);

		var response = this.http.request(request).toPromise();
		return response;
	}
}
