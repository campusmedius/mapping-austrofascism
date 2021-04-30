import { Component, OnInit, Input, HostBinding } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { Audio } from '../../models/information';

@Component({
    selector: 'cm-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.scss'],
    animations: [
        trigger('container', [
            state('true', style({ height: '*', display: '*' })),
            state('false', style({ height: '0px', display: 'none' })),
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
export class AudioComponent implements OnInit {
    @Input() data: Audio;
    @Input() lang: string;

    @Input() id: string;
    @HostBinding('attr.id')
    get elementId() { 
        if ((this.id + '').startsWith('a:')) {
            return (this.id + ''); 
        }
        return 'a:' + this.id; 
    }

    public opened = false;
    public openedFirst = false;

    constructor() { }

    ngOnInit() { }

    public onRightClick(e) {
        e.preventDefault();
    }

    public openInline() {
        this.opened = true;
        this.openedFirst = true;
    }

    public toggle() {
        this.opened = !this.opened;
        if(this.opened) {
            this.openedFirst = true;
        }
    }
}
