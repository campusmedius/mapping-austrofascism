import { Component, OnInit, Input } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { Block } from '../../models/information';

@Component({
    selector: 'cm-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
    animations: [
        trigger('container', [
            state('1', style({ height: '*' })),
            state('0', style({ height: '0px' })),
            transition('0 => 1', animate('300ms ease-in')),
            transition('1 => 0', animate('300ms ease-in'))
        ])
    ]
})
export class NoteComponent implements OnInit {
    @Input() content: string;
    @Input() lang: string;

    public opened = false;

    constructor() { }

    ngOnInit() {
    }

}
