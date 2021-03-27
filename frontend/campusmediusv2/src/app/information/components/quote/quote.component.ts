import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';

import { InformationMedia } from '../../models/information';

@Component({
    selector: 'cm-quote',
    templateUrl: './quote.component.html',
    styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
    @Input() content: string;
    @Input() lang: string;
    @Input() media: InformationMedia;

    @Input() id: string;
    @HostBinding('attr.id')
    get elementId() { 
        return 'q:' + this.id; 
    }

    @Output() closed = new EventEmitter();
    @Output() opened = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

}
