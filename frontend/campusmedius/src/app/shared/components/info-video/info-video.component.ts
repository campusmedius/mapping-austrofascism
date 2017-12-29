import { Component, OnInit, Input } from '@angular/core';

import { Video } from '../../models/information';

@Component({
    selector: 'cm-info-video',
    templateUrl: './info-video.component.html',
    styleUrls: ['./info-video.component.scss']
})
export class InfoVideoComponent implements OnInit {
    @Input() data: Video;
    @Input() lang: string;

    constructor() { }

    ngOnInit() {
    }
}
