import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Mediator } from '@app/topology/models/mediator';
import { Mediation } from '@app/topology/models/mediation';
import { Information } from '@app/information/models/information';
import { TranslateService } from '@ngx-translate/core';
import { MapComponent } from '../map/map';

const SIDEPANEL_WIDTH = {
    full: '70%',
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
export class TopologyComponent implements OnInit, AfterViewInit {
    public mediations: Mediation[];
    public selectedMediation: Mediation;
    public mediators: Mediator[];
    public visibleMediators: Mediator[];
    public selectedMediator: Mediator;
    public information: Information;


    public sidepanelWidth: string;
    public timelineHeight = '40px';
    public mobileOverlayHeight = '200px';

    sidepanelState = 'short'; // full, short
    isMobile = false;

    @ViewChild(MapComponent, {static: false}) map: MapComponent;

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.data.subscribe(data => {
            const previousMediator = this.selectedMediator;
            this.mediations = data.mediations;
            this.selectedMediation = data.selectedMediation;
            this.mediators = data.mediators;
            this.visibleMediators = [];
            this.selectedMediator = data.selectedMediator;

            if (this.selectedMediator) {
                this.visibleMediators = [ this.selectedMediator ];
                this.information = this.selectedMediator.information;
            } else if (this.selectedMediation.id === '2') {
                this.visibleMediators = [ this.selectedMediation.relations[0].source ];
            } else if (this.selectedMediation.id === '3') {
                this.visibleMediators = [ this.selectedMediation.relations[0].source ];
            }

            if (previousMediator) {
                previousMediator.relationsTo.forEach(r => {
                    if (r.targetId === this.selectedMediator.id) {
                        this.map.doNavigation(this.selectedMediation, r);
                    }
                });
            }
        });
    }

    ngAfterViewInit() {
        if (this.selectedMediation) {
            this.map.setPerspective(this.selectedMediation);
        }
        if (this.selectedMediator) {
            this.map.showMediator(this.selectedMediation, this.selectedMediator);
        } else {
            this.map.showMediationOverview(this.selectedMediation);
        }
    }

    public toggleInformationPanel() {
        if (this.sidepanelState === 'full') {
            this.sidepanelState = 'short';
        } else {
            this.sidepanelState = 'full';
        }
    }
}
