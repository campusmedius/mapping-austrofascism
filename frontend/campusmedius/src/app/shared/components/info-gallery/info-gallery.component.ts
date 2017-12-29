import { Component, OnInit, Input } from '@angular/core';

import { Gallery } from '../../models/information';

@Component({
    selector: 'cm-info-gallery',
    templateUrl: './info-gallery.component.html',
    styleUrls: ['./info-gallery.component.scss']
})
export class InfoGalleryComponent implements OnInit {
    @Input() data: Gallery;
    @Input() lang: string;

    constructor() { }

    ngOnInit() {
    }

}
