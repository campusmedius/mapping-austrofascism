import { Component, OnInit, Input } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { TopographyComponent } from '../../../topography/containers/topography/topography';

@Component({
    selector: 'cm-link-inpage',
    templateUrl: './link-inpage.component.html',
    styleUrls: ['./link-inpage.component.scss']
})
export class LinkInpageComponent implements OnInit {
    @Input() href: string;
    @Input() text = '';

    constructor(private _scrollToService: ScrollToService, private topography: TopographyComponent) { }

    ngOnInit() {
    }

    public scrollTo(anchor: string) {
        this._scrollToService.scrollTo({
            target: anchor,
            offset: -30
        });
    }

}
