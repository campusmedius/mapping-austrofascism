import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'cm-link-intern',
    templateUrl: './link-intern.component.html',
    styleUrls: ['./link-intern.component.scss']
})
export class LinkInternComponent implements OnInit {
    @Input() href: string;
    @Input() info = 'full';
    @Input() text = '';

    constructor() { }

    ngOnInit() {
    }

}
