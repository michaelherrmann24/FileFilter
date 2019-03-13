import { Injectable } from '@angular/core';

import { Storage } from "./AbstractStorage";

@Injectable()
export class SessionStorage extends Storage{
	constructor(){
		super();
		this.storage = window.sessionStorage;
	}
}
