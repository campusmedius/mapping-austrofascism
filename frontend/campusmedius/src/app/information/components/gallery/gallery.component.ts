import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '../../ngx-gallery/index';

import { Gallery, Image, Audio, Video } from '../../models/information';
import { InformationComponent } from '../information/information.component';

import 'hammerjs';

@Component({
    selector: 'cm-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {
    @Input() id: string;

    public galleryOptions: NgxGalleryOptions[];
    public galleryImages: NgxGalleryImage[];

    public data: Gallery;
    public lang: string;

    public isMobile: boolean;
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

            let smallUrl = e.data.thumbnail;
            let bigUrl = e.data.full;
            if (this.isMobile) {
                smallUrl = e.data.mobileThumbnail;
                bigUrl = e.data.mobileFull;
            }

            galleryImages.push({
                type: e.type,
                small: smallUrl,
                big: bigUrl,
                description: caption
            });
        });
        this.galleryImages = galleryImages;
    }

    public previewOpened() {
        document.getElementsByTagName('cm-topography')[0].classList.add('noscroll');
    }

    public previewClosed() {
        document.getElementsByTagName('cm-topography')[0].classList.remove('noscroll');
    }

    ngOnDestroy() {
        this.mediaSubscription.unsubscribe();
    }

}
