import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'cm-cite-dialog',
    templateUrl: './cite-dialog.component.html',
    styleUrls: ['./cite-dialog.component.scss']
})
export class CiteDialogComponent implements OnInit {

    public titleDe: string;
    public titleEn: string;
    public url: string;

    constructor(
        public translate: TranslateService,
        private dialogRef: MatDialogRef<CiteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.titleEn = '"' + this.data.event.titleEn + '" in <i>Campus Medius';
        this.titleDe = '"' + this.data.event.titleDe + '" in <i>Campus Medius';
        if (this.data.event.id === 'about' || this.data.event.id === 'team') {
            this.url = 'https://campusmedius.net/' + this.data.event.id + '?lang=' + this.translate.currentLang + '&info=full';
        } else {
            this.url = 'https://campusmedius.net/topography/events/' + this.data.event.id + '?lang=' + this.translate.currentLang + '&info=full';
        }
    }

    close() {
        this.dialogRef.close();
    }

    copyURLToClipboard() {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.url;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
}
