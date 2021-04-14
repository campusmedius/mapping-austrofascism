import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'cm-link-inpage',
    templateUrl: './link-inpage.component.html',
    styleUrls: ['./link-inpage.component.scss']
})
export class LinkInpageComponent implements OnInit {
    @Input() href: string;
    @Input() text = '';

    public fragment = '';

    constructor() { }

    ngOnInit() {
        const split = this.href.split('#');
        this.fragment = split[1];
    }

}
