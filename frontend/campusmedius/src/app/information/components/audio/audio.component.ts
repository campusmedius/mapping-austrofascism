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
import { InformationComponent } from '../information/information.component';

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
    @Input() id: string;

    public data: Audio;
    public lang: string;

    public opened = false;

    constructor(private information: InformationComponent) { }

    ngOnInit() {
        this.lang = this.information.lang;
        this.data = this.information.data.media.audios[this.id];
    }

    public onRightClick(e) {
        e.preventDefault();
    }
}
