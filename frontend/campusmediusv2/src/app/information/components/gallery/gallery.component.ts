import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

import { NgxGalleryOptions } from '../../ngx-gallery/ngx-gallery-options';
import { NgxGalleryAnimation } from '../../ngx-gallery/ngx-gallery-animation';
import { NgxGalleryImage } from '../../ngx-gallery/ngx-gallery-image';

import { Gallery, Image, Audio, Video } from '../../models/information';

import 'hammerjs';

@Component({
    selector: 'cm-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {
    @Input() data: Gallery;
    @Input() lang: string;

    @Output() closed = new EventEmitter();
    @Output() opened = new EventEmitter();

    public galleryOptions: NgxGalleryOptions[];
    public galleryImages: NgxGalleryImage[];

    public isMobile: boolean;
    mediaSubscription: Subscription;

    constructor(
        private mediaObserver: MediaObserver,
        private elmentRef: ElementRef
    ) {
        this.mediaSubscription = mediaObserver.media$.subscribe((change: MediaChange) => {
            if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
                this.isMobile = true;
            } else {
                this.isMobile = false;
            }
        });
    }

    ngOnInit() {
        this.galleryOptions = [{
            'previewInfinityMove': true,
            'previewKeyboardNavigation': true,
            'arrowPrevIcon': 'cm-chevron-left',
            'arrowNextIcon': 'cm-chevron-right',
            'closeIcon': 'cm-square-close',
            'thumbnailsSwipe': true,
            'previewSwipe': true,
            'image': false,
            'height': '200px',
            'width': '100%'
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

            let smallUrl = e.data.thumbnail;
            let bigUrl = e.data.full;
            if (this.isMobile) {
                smallUrl = e.data.mobileThumbnail;
                bigUrl = e.data.mobileFull;
            }

            galleryImages.push({
                cmtype: e.type,
                small: smallUrl,
                big: bigUrl,
                description: caption
            });
        });
        this.galleryImages = galleryImages;
    }

    public previewOpened() {
        this.opened.emit();

        const placeholders = <any>document.getElementsByClassName('placeholder-scroll');
        if (placeholders[0]) {
            placeholders[0].style.height = '0px';
        }

        const elements = <any>document.getElementsByTagName('cm-topography');
        if (elements[0]) {
            elements[0].classList.add('noscroll');
            if (!this.isMobile && (<any>window).isSafari) {
                elements[0].style.zIndex = 99;
            }
        }
    }

    public previewClosed() {
        const placeholders = <any>document.getElementsByClassName('placeholder-scroll');
        if (placeholders[0]) {
            placeholders[0].style.height = '';
        }

        const elements = <any>document.getElementsByTagName('cm-topography');
        if (elements[0]) {
            elements[0].classList.remove('noscroll');
            if (!this.isMobile && (<any>window).isSafari) {
                elements[0].style.zIndex = '';
            }
        }
        const previewElements = <any>document.getElementsByClassName('ngx-gallery-preview-wrapper');
        if (previewElements[0]) {
            const audioElements = previewElements[0].getElementsByTagName('audio');
            for (const e of audioElements) {
                e.pause();
            }
        }
        this.closed.emit();
    }

    ngOnDestroy() {
        this.mediaSubscription.unsubscribe();
    }

}
