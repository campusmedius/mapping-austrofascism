import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'cm-cite-dialog',
    templateUrl: './cite-dialog.component.html',
    styleUrls: ['./cite-dialog.component.scss']
})
export class CiteDialogComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

}
