import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';
import * as moment from 'moment';

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
    public currentYear: string;
    public abstractEn: string;
    public abstractDe: string;
    public abstractShortEn: string;
    public abstractShortDe: string;
    public abstractExpanded = false;
    public abstractShowExpanded = true;
    public keywordsEn: string[];
    public keywordsDe: string[];
    public keywordsEnStr: string;
    public keywordsDeStr: string;
    public keywordsShortEnStr: string;
    public keywordsShortDeStr: string;
    public keywordsExpanded = false;
    public keywordsShowExpanded = true;
    public url: string;
    public copyUrlStr: string;

    constructor(
        public translate: TranslateService,
        private dialogRef: MatDialogRef<CiteDialogComponent>,
        private clipboard: Clipboard,
        @Inject(DOCUMENT) private document: Document,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        if (this.data.type === 'event') {
            this.url = 'https://mapping-austrofascism.campusmedius.net/topography/events/' + this.data.data.id + '?lang=' + this.translate.currentLang + '&info=full';
        } else if (this.data.type === 'mediator') {
            this.url = 'https://mapping-austrofascism.campusmedius.net/topology/mediations/' + this.data.mediationId + '/mediators/' + this.data.data.id + '?lang=' + this.translate.currentLang + '&info=full';
        } else if (this.data.type === 'page') {
            this.url = 'https://mapping-austrofascism.campusmedius.net';
            if(this.data.data.titleEn === 'Overview') {
                this.url += '/overview' + '?lang=' + this.translate.currentLang;
            } else if(this.data.data.titleEn === 'Project Team') {
                this.url += '/team' + '?lang=' + this.translate.currentLang;
            } else if(this.data.data.titleEn === 'Book Edition') {
                this.url += '/book' + '?lang=' + this.translate.currentLang;
            } else if(this.data.data.titleEn === 'Disclosure') {
                this.url += '/disclosure' + '?lang=' + this.translate.currentLang;
            }
        } else {
            this.url = 'https://mapping-austrofascism.campusmedius.net' + '?lang=' + this.translate.currentLang;
        }

        this.copyUrlStr = this.url;

        this.url = this.url.replace(/\//g, '/\u200B');
        this.url = this.url.replace(/\./g, '.\u200B');

        this.titleEn = this.data.data.titleEn.replace(/"/g, '');
        this.titleDe = this.data.data.titleDe.replace(/"/g, '');

        this.data.data.created.locale('de-at');
        this.data.data.updated.locale('de-at');
        this.publishedDe = this.data.data.created.format('D.\u00a0MMMM YYYY');
        this.updatedDe = this.data.data.updated.format('D.\u00a0MMMM YYYY');
        this.data.data.created.locale('en');
        this.data.data.updated.locale('en');
        this.publishedEn = this.data.data.created.format('MMMM\u00a0D, YYYY');
        this.updatedEn = this.data.data.updated.format('MMMM\u00a0D, YYYY');
        this.updatedYear = this.data.data.updated.format('YYYY');
        this.currentYear = moment().format('YYYY');

        this.abstractEn = this.data.data.abstractEn.replace(/<p>/g, '').replace(/<\/p>/g, '');
        this.abstractDe = this.data.data.abstractDe.replace(/<p>/g, '').replace(/<\/p>/g, '');
        this.abstractShortEn = this.abstractEn.split(' ').slice(0,5).join(' ') + ' \u2026';
        this.abstractShortDe = this.abstractDe.split(' ').slice(0,5).join(' ') + ' \u2026';

        this.keywordsEn = this.data.data.keywordsEn.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        this.keywordsEnStr = this.keywordsEn.join(', ');
        this.keywordsDe = this.data.data.keywordsDe.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
        this.keywordsDeStr = this.keywordsDe.join(', ');
        if (this.keywordsEn.length > 3) {
            this.keywordsShortEnStr = this.keywordsEn.slice(0,3).join(', ') + ', \u2026';
            this.keywordsShowExpanded = true;
        } else {
            this.keywordsShortEnStr = this.keywordsEnStr;
            this.keywordsShowExpanded = false;
        }
        if (this.data.data.keywordsDe.length > 3) {
            this.keywordsShortDeStr = this.keywordsDe.slice(0,3).join(', ') + ', \u2026';
            this.keywordsShowExpanded = true;
        } else {
            this.keywordsShortDeStr = this.keywordsDeStr;
            this.keywordsShowExpanded = false;
        }

    }

    public close() {
        this.dialogRef.close();
    }

    public copyUrl() {
        this.clipboard.copy(this.copyUrlStr);
    }

    public copyCitation() {
        let citation;
        if (this.translate.currentLang === 'en') {
            let transStr = ''
            if (this.data.type === 'event') {
                transStr = ' trans. by Katy Derbyshire,';
            }
            if (this.data.type === 'mediator' && this.data.data.id !== '0') {
                transStr = ' trans. by Maria Slater,';
            }
            citation = 'Simon Ganahl: "' + this.titleEn + ',"' + transStr +' last modified on ' + this.updatedEn + ', in: Simon Ganahl et al.: Mapping Austrofascism, 2014–' + this.currentYear + ', URL: ' + this.copyUrlStr;
        } else {
            citation = 'Simon Ganahl: "' + this.titleDe + '", zuletzt aktualisiert am ' + this.updatedDe + ', in: Simon Ganahl u.a.: Mapping Austrofascism, 2014–' + this.currentYear + ', URL: ' + this.copyUrlStr;
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