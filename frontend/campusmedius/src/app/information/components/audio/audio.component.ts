import { Component, OnInit, Input } from '@angular/core';
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
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class AudioComponent implements OnInit {
    @Input() data: Audio;
    @Input() lang: string;

    public opened = false;

    constructor() { }

    ngOnInit() { }

    public onRightClick(e) {
        e.preventDefault();
    }
}
