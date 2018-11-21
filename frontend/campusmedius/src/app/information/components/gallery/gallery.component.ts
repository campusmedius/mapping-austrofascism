import { Component, OnInit, Input } from '@angular/core';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

import { Gallery, Image, Audio, Video } from '../../models/information';
import { InformationComponent } from '../information/information.component';

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
            'previewKeyboardNavigation': true,
            'arrowPrevIcon': 'fa fa-angle-left',
            'arrowNextIcon': 'fa fa-angle-right',
            'image': false, 'height': '200px', width: '100%'
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
