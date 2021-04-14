import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Mediator } from '@app/topology/models/mediator';

@Component({
    selector: 'cm-god-selector',
    templateUrl: './god-selector.html',
    styleUrls: ['./god-selector.scss']
})
export class GodSelectorComponent implements OnInit {

    @Input() mediators: Mediator[];
    @Input() lang: string;
    @Input() isMobile: string;
    @Input() sidepanelStateForLinks: string;

    @HostBinding('style.right')
    @Input() overlayRightSize = '0px';

    @HostBinding('style.bottom')
    @Input() overlayBottomSize = '0px';

    constructor() { }

    ngOnInit() {
    }

}
