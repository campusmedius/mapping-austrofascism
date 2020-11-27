import { Component, OnInit, Input, HostBinding } from '@angular/core';

import { Block } from '../../models/information';

@Component({
    selector: 'cm-quote',
    templateUrl: './quote.component.html',
    styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
    @Input() content: string;
    @Input() lang: string;

    @Input() id: string;
    @HostBinding('attr.id')
    get elementId() { 
        return 'q:' + this.id; 
    }

    constructor() { }

    ngOnInit() {
    }

}
