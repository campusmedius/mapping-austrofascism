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

    public fragment = '';

    constructor() { }

    ngOnInit() {
        if (this.href.indexOf('#')) {
            const split = this.href.split('#');
            this.href = split[0];
            this.fragment = split[1];
        }

        if (this.href.startsWith('events')) {
            this.href = /topography/ + this.href;
        }
    }

}
