import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'cm-link-extern',
    templateUrl: './link-extern.component.html',
    styleUrls: ['./link-extern.component.scss']
})
export class LinkExternComponent implements OnInit {
    @Input() href: string;

    constructor() { }

    ngOnInit() {
    }

}
