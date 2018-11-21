import { Component, OnInit, Input } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { Video } from '../../models/information';
import { InformationComponent } from '../information/information.component';


@Component({
    selector: 'cm-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
    animations: [
        trigger('container', [
            state('true', style({ height: '*', display: '*' })),
            state('false', style({ height: '0px', display: 'none' })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class VideoComponent implements OnInit {
    @Input() id: string;

    public data: Video;
    public lang: string;

    public opened = false;

    constructor(private information: InformationComponent) { }

    ngOnInit() {
        this.lang = this.information.lang;
        this.data = this.information.data.media.videos[this.id];
    }
}
