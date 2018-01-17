import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Information, InformationMedia, Block } from '../../models/information';

import { InfoImageComponent } from '../info-image/info-image.component';

@Component({
    selector: 'cm-info-information',
    templateUrl: './info-information.component.html',
    styleUrls: ['./info-information.component.scss']
})
export class InfoInformationComponent implements OnInit, OnChanges {
    @Input() data: Information;
    @Input() lang: string;

    public content: SafeHtml;
    private blocksDe: Block[] = [];
    private blocksEn: Block[] = [];
    public blocks: Block[] = [];

    private initialized = false;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.generateBlocks();
        this.setBlocks();

        this.initialized = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.initialized) {
            return;
        }

        if (changes['data']) {
            if (!this.data) {
                this.blocks = null;
            } else {
                this.generateBlocks();
                this.setBlocks();
            }
        }

        if (changes['lang']) {
            this.setBlocks();
        }
    }

    private generateBlocks() {
        this.blocksDe = this.generateBlocksFromContent(this.data.contentDe, this.data.media);
        this.blocksEn = this.generateBlocksFromContent(this.data.contentEn, this.data.media);
    }

    private setBlocks() {
        if (this.lang === 'de') {
            this.blocks = this.blocksDe;
        } else if (this.lang === 'en') {
            this.blocks = this.blocksEn;
        } else {
            this.blocks = null;
        }
    }

    private generateBlocksFromContent(content: string, media: InformationMedia): Block[] {
        const blocks: Block[] = [];

        const splits = content.split(/\[\[|\]\]/);
        splits.forEach(e => {
            let type = null;
            let data = null;

            if (e.startsWith('image:')) {
                const eSplit = e.split(':');
                type = 'image';
                data = media['images'][eSplit[1]];
            } else if (e.startsWith('audio:')) {
                const eSplit = e.split(':');
                type = 'audio';
                data = media['audios'][eSplit[1]];
            } else if (e.startsWith('video:')) {
                const eSplit = e.split(':');
                type = 'video';
                data = media['videos'][eSplit[1]];
            } else if (e.startsWith('gallery:')) {
                const eSplit = e.split(':');
                type = 'gallery';
                data = media['galleries'][eSplit[1]];
            } else {
                if (e.startsWith('</p>')) {
                    e = e.substring(4, e.length);
                }
                if (e.endsWith('<p>')) {
                    e = e.substring(0, e.length - 3);
                }
                type = 'text';
                data = e;
            }
            blocks.push({
                type: type,
                data: data
            });
        });

        return blocks;
    }
}
