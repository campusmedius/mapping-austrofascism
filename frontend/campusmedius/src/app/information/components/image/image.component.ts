import { Component, OnInit, Input } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

import { Image } from '../../models/information';
import { InformationComponent } from '../information/information.component';

@Component({
    selector: 'cm-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
    animations: [
        trigger('container', [
            state('true', style({ height: '*', display: '*' })),
            state('false', style({ height: '0px', display: 'none' })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class ImageComponent implements OnInit {
    @Input() id: string;

    public galleryOptions: NgxGalleryOptions[];
    public galleryImages: NgxGalleryImage[];

    public data: Image;
    public lang: string;

    public opened = false;

    constructor(private information: InformationComponent) { }

    ngOnInit() {
        this.lang = this.information.lang;
        this.data = this.information.data.media.images[this.id];

        this.galleryOptions = [{
            'image': false,
            'thumbnailsColumns': 1,
            'closeIcon': 'cm-square-close',
            'width': '100%',
            'spinnerIcon': 'fa fa-spinner fa-pulse fa-3x fa-fw'
        }];

        this.galleryImages = [{
            type: 'image',
            small: this.data.data.thumbnail,
            big: this.data.data.full,
            description: this.lang === 'de' ? this.data.captionDe : this.data.captionEn
        }];
    }
}
