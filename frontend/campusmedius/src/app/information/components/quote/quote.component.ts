import { Component, OnInit, Input } from '@angular/core';

import { Block } from '../../models/information';

@Component({
    selector: 'cm-quote',
    templateUrl: './quote.component.html',
    styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
    @Input() content: Block[];
    @Input() lang: string;

    constructor() { }

    ngOnInit() {
    }

}
