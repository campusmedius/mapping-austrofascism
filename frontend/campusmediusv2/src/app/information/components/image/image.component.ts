import {
    Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, HostBinding
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { Subscription } from 'rxjs';

import { NgxGalleryComponent } from '../../ngx-gallery/ngx-gallery.component';
import { NgxGalleryOptions } from '../../ngx-gallery/ngx-gallery-options';
import { NgxGalleryAnimation } from '../../ngx-gallery/ngx-gallery-animation';
import { NgxGalleryImage } from '../../ngx-gallery/ngx-gallery-image';

import { Image } from '../../models/information';

@Component({
    selector: 'cm-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
    animations: [
        trigger('container', [
            state('true', style({ height: '*', display: '*' })),
            state('false', style({ height: '0px', display: 'none' })),
            transition('false => true', [
                style({ 'display': 'block' }),
                animate('300ms ease-in')
            ]),
            transition('true => false', [
                animate('300ms ease-in')
            ])
        ])
    ]
})
export class ImageComponent implements OnInit, OnDestroy {
    @Input() data: Image;
    @Input() lang: string;

    @Input() id: string;
    @HostBinding('attr.id')
    get elementId() { 
        return 'i:' + this.id; 
    }

    @Output() closed = new EventEmitter();
    @Output() opened = new EventEmitter();

    @ViewChild('gallery') gallery: NgxGalleryComponent;

    public galleryOptions: NgxGalleryOptions[];
    public galleryImages: NgxGalleryImage[];

    public isMobile: boolean;

    public isOpen = false;

    mediaSubscription: Subscription;

    constructor(
        private mediaObserver: MediaObserver
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

        this.galleryImages = [
          {
            cmtype: 'image',
            small: full,
            big: full,
            description: this.lang === 'de' ? this.data.captionDe : this.data.captionEn
        }
      ];

    }

    public openInline() {
        this.isOpen = true;
    }

    public showImage() {
        this.gallery.openPreview(0);
    }

    public onRightClick(e) {
        e.preventDefault();
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
            if (!this.isMobile && typeof window !== 'undefined' && (<any>window).isSafari) {
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
            if (!this.isMobile && typeof window !== 'undefined' && (<any>window).isSafari) {
                elements[0].style.zIndex = '';
            }
        }
        this.closed.emit();
    }

    ngOnDestroy() {
        this.mediaSubscription.unsubscribe();
    }

}
