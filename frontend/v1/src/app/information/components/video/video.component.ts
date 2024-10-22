import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { Video } from '../../models/information';

import * as Hls from 'hls.js';

@Component({
    selector: 'cm-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
    animations: [
        trigger('container', [
            state('true', style({ height: '*', display: '*' })),
            state('false', style({ height: '0px', display: 'none' })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class VideoComponent implements OnInit {
    @Input() data: Video;
    @Input() lang: string;

    @ViewChild('video') videoElement: ElementRef;

    public opened = false;
    private hls: Hls;

    constructor() { }

    ngOnInit() { }

    toggle() {
        if (!this.opened) {
            this.opened = true;
            if (Hls.isSupported()) {
                this.hls = new Hls({
                    maxBufferLength: 10,
                    maxBufferSize: 1000 * 512
                });
                this.hls.attachMedia(this.videoElement.nativeElement);
                this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    this.hls.loadSource(this.data.data.full);
                });
            } else {
                this.videoElement.nativeElement.src = this.data.data.full;
            }
        } else {
            this.opened = false;
            if (this.hls) {
                this.hls.destroy();
            }
        }
    }

    public onRightClick(e) {
        e.preventDefault();
    }
}
