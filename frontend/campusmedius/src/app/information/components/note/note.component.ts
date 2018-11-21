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
    selector: 'cm-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
    animations: [
        trigger('container', [
            state('true', style({ height: '*', display: '*' })),
            state('false', style({ height: '0px', display: 'none' })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class NoteComponent implements OnInit {
    public opened = false;

    constructor() { }

    ngOnInit() {
    }

}
