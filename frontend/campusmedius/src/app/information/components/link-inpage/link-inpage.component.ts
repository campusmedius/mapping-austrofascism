import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'cm-link-inpage',
    templateUrl: './link-inpage.component.html',
    styleUrls: ['./link-inpage.component.scss']
})
export class LinkInpageComponent implements OnInit {
    @Input() href: string;

    constructor() { }

    ngOnInit() {
    }

}
