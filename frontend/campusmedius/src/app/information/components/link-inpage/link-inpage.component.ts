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

    constructor(private _scrollToService: ScrollToService, private topography: TopographyComponent) { }

    ngOnInit() {
    }

    public scrollTo(anchor: string) {
        if (this.topography.isMobile) {
            this._scrollToService.scrollTo({
                target: anchor,
                container: <any>document.getElementsByTagName('cm-topography')[0],
                offset: -30
            });
        } else {
            this._scrollToService.scrollTo({
                target: anchor
            });
        }


    }

}
