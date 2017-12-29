import { Component, OnInit, Input } from '@angular/core';

import { Audio } from '../../models/information';

@Component({
    selector: 'cm-info-audio',
    templateUrl: './info-audio.component.html',
    styleUrls: ['./info-audio.component.scss']
})
export class InfoAudioComponent implements OnInit {
    @Input() data: Audio;
    @Input() lang: string;

    constructor() { }

    ngOnInit() {
    }

}
