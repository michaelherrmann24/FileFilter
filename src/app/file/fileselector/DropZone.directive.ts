import {
	Directive,
	HostListener,
	Output,
	EventEmitter
} from '@angular/core';

import {EntryExitLogger,Loggable} from '../../common/Common.module';

@Loggable("app.file.fileselector")
@Directive({
	selector: '[drop-zone]'
})
export class DropZoneDirective{

	@Output() dropped:EventEmitter<DataTransfer>= new EventEmitter<DataTransfer>();

	constructor(){}

	@HostListener("dragover",['$event'])
	public drag(evt:Event):void{
		this.preventAndStopEventPropagation(evt);
		let dataTransfer:DataTransfer = this.getDataTransferObject(evt);
		dataTransfer.dropEffect = "copy";
	}

	@EntryExitLogger
	@HostListener("drop",['$event'])
	public drop(evt:Event) : void{
		this.preventAndStopEventPropagation(evt);
		let dataTransfer:DataTransfer = this.getDataTransferObject(evt);
		this.dropped.emit(dataTransfer);
	}

	private preventAndStopEventPropagation(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
	}

	private getDataTransferObject(event: Event | any): DataTransfer {
		return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
	}
}
