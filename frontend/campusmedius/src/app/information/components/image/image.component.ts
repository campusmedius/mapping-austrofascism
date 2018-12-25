import {
    Component, OnInit, Input, ViewChild, ViewContainerRef,
    ComponentRef, NgModule, ModuleWithComponentFactories, Compiler, OnDestroy
} from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { Subscription } from 'rxjs/Subscription';

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
export class ImageComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @ViewChild('gallery') gallery: NgxGalleryComponent;

    public galleryOptions: NgxGalleryOptions[];
    public galleryImages: NgxGalleryImage[];

    public data: Image;
    public lang: string;

    public isMobile: boolean;

    public opened = false;

    mediaSubscription: Subscription;

    constructor(private information: InformationComponent,
        private media: ObservableMedia,
    ) {
        this.mediaSubscription = media.subscribe((change: MediaChange) => {
            if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
                this.isMobile = true;
            } else {
                this.isMobile = false;
            }
        });
    }

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

        let full = this.data.data.full;
        if (this.isMobile) {
            full = this.data.data.mobileFull;
        }

        this.galleryImages = [{
            type: 'image',
            small: full,
            big: full,
            description: this.lang === 'de' ? this.data.captionDe : this.data.captionEn
        }];

    }

    public showImage() {
        this.gallery.openPreview(0);
    }

    public onRightClick(e) {
        e.preventDefault();
    }

    ngOnDestroy() {
        this.mediaSubscription.unsubscribe();
    }

}
