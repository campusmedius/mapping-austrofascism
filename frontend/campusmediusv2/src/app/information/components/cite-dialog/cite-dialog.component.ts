import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'cm-cite-dialog',
    templateUrl: './cite-dialog.component.html',
    styleUrls: ['./cite-dialog.component.scss']
})
export class CiteDialogComponent implements OnInit {
    public titleDe: string;
    public titleEn: string;
    public publishedDe: string;
    public publishedEn: string;
    public updatedDe: string;
    public updatedEn: string;
    public updatedYear: string;
    public keywordsEn: string;
    public keywordsDe: string;
    public keywordsShortEn: string;
    public keywordsShortDe: string;
    public keywordsExpanded = false;
    public keywordsShowExpanded = true;
    public url: string;

    constructor(
        public translate: TranslateService,
        private dialogRef: MatDialogRef<CiteDialogComponent>,
        private clipboard: Clipboard,
        @Inject(DOCUMENT) private document: Document,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        if (this.data.type === 'event') {
            this.url = 'https://campusmedius.net/topography/events/' + this.data.data.id;
        } else if (this.data.type === 'mediator') {
            this.url = 'https://campusmedius.net/topology/mediations/' + this.data.mediationId + '/mediators/' + this.data.data.id;
        } else if (this.data.type === 'page') {
            this.url = 'https://campusmedius.net';
            if(this.data.data.titleEn === 'Overview') {
                this.url += '/overview';
            } else if(this.data.data.titleEn === 'Project Team') {
                this.url += '/team';
            } else if(this.data.data.titleEn === 'Book Edition') {
                this.url += '/book';
            }
        } else {
            this.url = 'https://campusmedius.net';
        }

        this.titleEn = this.data.data.titleEn.replace(/"/g, '');
        this.titleDe = this.data.data.titleDe.replace(/"/g, '');

        this.data.data.created.locale('de-at');
        this.data.data.updated.locale('de-at');
        this.publishedDe = this.data.data.created.format('D. MMMM YYYY');
        this.updatedDe = this.data.data.updated.format('D. MMMM YYYY');
        this.data.data.created.locale('en');
        this.data.data.updated.locale('en');
        this.publishedEn = this.data.data.created.format('MMMM D, YYYY');
        this.updatedEn = this.data.data.updated.format('MMMM D, YYYY');
        this.updatedYear = this.data.data.updated.format('YYYY');

        this.keywordsEn = this.data.data.keywordsEn.join(', ');
        this.keywordsDe = this.data.data.keywordsDe.join(', ');
        if (this.data.data.keywordsEn.length > 5) {
            this.keywordsShortEn = this.data.data.keywordsEn.slice(0,5).join(', ') + ', ...';
            this.keywordsShowExpanded = true;
        } else {
            this.keywordsShortEn = this.keywordsEn;
            this.keywordsShowExpanded = false;
        }
        if (this.data.data.keywordsEn.length > 5) {
            this.keywordsShortDe = this.data.data.keywordsDe.slice(0,5).join(', ') + ', ...';
            this.keywordsShowExpanded = true;
        } else {
            this.keywordsShortDe = this.keywordsDe;
            this.keywordsShowExpanded = false;
        }

    }

    public close() {
        this.dialogRef.close();
    }

    public copyUrl() {
        this.clipboard.copy(this.url);
    }

    public copyCitation() {
        let citation;
        if (this.translate.currentLang === 'en') {
            citation = 'Simon Ganahl et al.: "' + this.titleEn + '", last updated on ' + this.updatedEn + ', in: Campus Medius, 2014–2021, URL: ' + this.url;
        } else {
            citation = 'Simon Ganahl u.a.: "' + this.titleDe + '", zuletzt aktualisiert am ' + this.updatedDe + ', in: Campus Medius, 2014–2021, URL: ' + this.url;
        }
        this.clipboard.copy(citation);
    }

    public downloadJsonLd() {
        let jsonLdScript = <HTMLScriptElement>this.document.getElementById('jsonld');
        let exportName = 'campusmedius-';
        if (this.translate.currentLang === 'en') {
            exportName += this.titleEn.toLowerCase().replace(/ /g, "-");
        } else {
            exportName += this.titleDe.toLowerCase().replace(/ /g, "-");
        }
        
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonLdScript.text);
        var downloadAnchorNode = this.document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".jsonld");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}