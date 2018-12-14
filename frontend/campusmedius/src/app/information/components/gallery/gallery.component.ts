import { Component, OnInit, Input } from '@angular/core';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '../../ngx-gallery/index';

import { Gallery, Image, Audio, Video } from '../../models/information';
import { InformationComponent } from '../information/information.component';

import 'hammerjs';

@Component({
    selector: 'cm-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
    @Input() id: string;

    public galleryOptions: NgxGalleryOptions[];
    public galleryImages: NgxGalleryImage[];

    public data: Gallery;
    public lang: string;

    constructor(private information: InformationComponent) { }

    ngOnInit() {
        this.lang = this.information.lang;
        this.data = this.information.data.media.galleries[this.id];

        this.galleryOptions = [{
            'previewInfinityMove': true,
            'previewKeyboardNavigation': true,
            'arrowPrevIcon': 'cm-chevron-left',
            'arrowNextIcon': 'cm-chevron-right',
            'closeIcon': 'cm-square-close',
            'thumbnailsSwipe': true,
            'previewSwipe': true,
            'image': false, 'height': '200px', width: '100%'
        }, {
            'breakpoint': 1400,
            'thumbnailsColumns': 3
        }, {
            'breakpoint': 959,
            'thumbnailsColumns': 2.2,
            'thumbnailsArrows': false,
            'imageArrows': false
        }];

        const galleryImages = [];
        this.data.entities.forEach(e => {
            let caption = e.captionEn;
            if (this.lang === 'de') {
                caption = e.captionDe;
            }

            const smallUrl = e.data.thumbnail;
            const bigUrl = e.data.full;

            galleryImages.push({
                type: e.type,
                small: smallUrl,
                big: bigUrl,
                description: caption
            });
        });
        this.galleryImages = galleryImages;
    }
}
