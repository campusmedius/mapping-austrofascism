import {
    Component, OnInit, Input, ViewChild, ViewContainerRef,
    ComponentRef, NgModule, ModuleWithComponentFactories, Compiler
} from '@angular/core';

import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryComponent } from '../../ngx-gallery/index';

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
    @ViewChild('gallery') gallery: NgxGalleryComponent;

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
            'thumbnails': false,
            'closeIcon': 'cm-square-close',
            'width': '0px',
            'height': '0px',
            'spinnerIcon': 'fa fa-spinner fa-pulse fa-3x fa-fw'
        }];

        this.galleryImages = [{
            type: 'image',
            small: this.data.data.full,
            big: this.data.data.full,
            description: this.lang === 'de' ? this.data.captionDe : this.data.captionEn
        }];

    }

    public showImage() {
        this.gallery.openPreview(0);
    }

}
