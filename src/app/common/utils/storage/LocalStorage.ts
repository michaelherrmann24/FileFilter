import { Injectable } from '@angular/core';

import { Storage } from "./AbstractStorage";

@Injectable()
export class LocalStorage extends Storage{
	constructor(){
		super();
		this.storage = window.localStorage;
	}
}
