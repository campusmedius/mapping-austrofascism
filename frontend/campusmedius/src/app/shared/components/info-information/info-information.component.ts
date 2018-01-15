import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Information } from '../../models/information';

import { InfoImageComponent } from '../info-image/info-image.component';

@Component({
    selector: 'cm-info-information',
    templateUrl: './info-information.component.html',
    styleUrls: ['./info-information.component.scss']
})
export class InfoInformationComponent implements OnInit {
    @Input() data: Information;
    @Input() lang: string;

    public content: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
        this.content = this.sanitizer.bypassSecurityTrustHtml('sddsa <div #test id="test"> sdsdd</div> adsda');
    }

    ngOnInit() {
    }
}
