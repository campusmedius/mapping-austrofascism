import { Component, OnInit, Input, ViewChild, ElementRef, HostBinding } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';

import { Video } from '../../models/information';

declare var SWITCHtubeEmbed: any;

@Component({
    selector: 'cm-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
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
export class VideoComponent implements OnInit {
    @Input() data: Video;
    @Input() lang: string;

    @Input() id: string;
    @HostBinding('attr.id')
    get elementId() { 
        if ((this.id + '').startsWith('v:')) {
            return (this.id + ''); 
        }
        return 'v:' + this.id; 
    }

    @ViewChild('video') videoElement: ElementRef;

    public opened = false;
    public openedFirst = false;

    constructor() { }

    ngOnInit() { }

    
    toggle() {
        if (!this.opened) {
            this.opened = true;
            this.openedFirst = true;

            var kalturaPlayer = (window as any).KalturaPlayer.setup({
                targetId: 'video-inline-' + this.id,
                provider: {
                    partnerId: 106,
                    uiConfId: 23449004
                },
                playback: {
                    autoplay: true
                }
            });

            // Create a URL object
            var url = new URL(this.data.data.full);
            // Use URLSearchParams to get query parameters
            var params = new URLSearchParams(url.search);
            // Extract the entry_id
            var entryId = params.get('entry_id');

            kalturaPlayer.loadMedia({entryId: entryId});

        } else {
            this.videoElement.nativeElement.innerText = '';
            this.opened = false;
        }
    }

    public openInline() {
        if (!this.opened) {
            this.toggle();
        }
    }

    public onRightClick(e) {
        e.preventDefault();
    }
}