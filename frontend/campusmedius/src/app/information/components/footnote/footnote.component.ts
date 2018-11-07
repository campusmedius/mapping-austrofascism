import { Component, OnInit } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

@Component({
    selector: 'cm-footnote',
    templateUrl: './footnote.component.html',
    styleUrls: ['./footnote.component.scss'],
    animations: [
        trigger('container', [
            state('true', style({ height: '*', display: '*' })),
            state('false', style({ height: '0px', display: 'none' })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class FootnoteComponent implements OnInit {
    public opened = false;

    constructor() { }

    ngOnInit() {
    }

}
