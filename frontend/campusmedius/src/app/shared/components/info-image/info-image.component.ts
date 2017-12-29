import { Component, OnInit, Input } from '@angular/core';

import { Image } from '../../models/information';

@Component({
    selector: 'cm-info-image',
    templateUrl: './info-image.component.html',
    styleUrls: ['./info-image.component.scss']
})
export class InfoImageComponent implements OnInit {
    @Input() data: Image;
    @Input() lang: string;

    constructor() { }

    ngOnInit() {
    }

}
