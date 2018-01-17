import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'cm-info-text',
    templateUrl: './info-text.component.html',
    styleUrls: ['./info-text.component.scss']
})
export class InfoTextComponent implements OnInit {
    @Input() data: string;

    public content: SafeHtml;

    private initialized = false;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.setContent();

        this.initialized = true;
    }

    private setContent() {
        this.content = this.sanitizer.bypassSecurityTrustHtml(this.data);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.initialized) {
            return;
        }

        if (changes['data']) {
            this.setContent();
        }
    }



}
