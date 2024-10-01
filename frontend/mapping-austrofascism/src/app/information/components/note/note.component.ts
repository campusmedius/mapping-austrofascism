import { Component, OnInit, Input, HostBinding } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { Block, InformationMedia } from '../../models/information';

@Component({
    selector: 'cm-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
    animations: [
        trigger('container', [
            state('true', style({ 'height': '*', display: '*' })),
            state('false', style({ 'height': '0px', display: 'none' })),
            transition('false => true', [
                style({ 'display': 'block' }),
                animate('300ms ease-in')
            ]),
            transition('true => false', [
                animate('300ms ease-in')
            ])
        ])
    ]
})
export class NoteComponent implements OnInit {
    @Input() content: string;
    @Input() lang: string;
    @Input() media: InformationMedia;

    @Input() id: string;
    @HostBinding('attr.id')
    get elementId() { 
        if ((this.id + '').startsWith('n:')) {
            return (this.id + ''); 
        }
        return 'n:' + this.id; 
    }

    public opened = false;
    public openedFirst = false;

    constructor() { }

    ngOnInit() {
    }

    public openInline() {
        this.opened = true;
        this.openedFirst = true;
    }

    public toogle() {
        this.opened = !this.opened;
        if(this.opened) {
            this.openedFirst = true;
        }
    }


}
