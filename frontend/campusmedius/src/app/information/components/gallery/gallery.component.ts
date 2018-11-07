import { Component, OnInit, Input } from '@angular/core';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

import { Gallery } from '../../models/information';
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
        this.data.images.forEach(i => {
            const image = this.information.data.media.images[i];
            let caption = image.captionEn;
            if (this.lang === 'de') {
                caption = image.captionDe;
            }
            galleryImages.push({
                small: image.url,
                medium: image.url,
                big: image.url,
                description: caption
            });
        });
        this.galleryImages = galleryImages;
    }
}
