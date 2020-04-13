import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Mediator } from '@app/topology/models/mediator';
import { Information } from '@app/information/models/information';
import { TranslateService } from '@ngx-translate/core';

const SIDEPANEL_WIDTH = {
    full: '75%',
    short: '470px',
};

@Component({
    selector: 'cm-topology',
    templateUrl: './topology.html',
    styleUrls: ['./topology.scss'],
    animations: [
        trigger('sidenavIcon', [
            state('full', style({ transform: 'scaleX(1)' })),
            state('short', style({ transform: 'scaleX(-1)' })),
            transition('full <=> short', animate('300ms ease-in'))
        ]),
        trigger('sidenav', [
            state('full', style({ width: SIDEPANEL_WIDTH.full })),
            state('short', style({ width: SIDEPANEL_WIDTH.short })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('timeline', [
            state('full', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.full + ')' })),
            state('short', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.short + ')' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('titleHeader', [
            state('0', style({ opacity: 0 })),
            state('1', style({ opacity: 1 })),
            transition('0 <=> 1', animate('300ms ease-in'))
        ])
    ]
})
export class TopologyComponent implements OnInit {
    public mediators: Mediator[];
    public selectedMediator: Mediator;
    public information: Information;

    sidepanelState = 'short'; // full, short
    isMobile = false;

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.mediators = data.mediators;
            this.selectedMediator = data.selectedMediator;
            if (this.selectedMediator) {
                this.information = this.selectedMediator.information;
            }
        });
    }

    public toggleInformationPanel() {
        if (this.sidepanelState === 'full') {
            this.sidepanelState = 'short';
        } else {
            this.sidepanelState = 'full';
        }
    }
}
