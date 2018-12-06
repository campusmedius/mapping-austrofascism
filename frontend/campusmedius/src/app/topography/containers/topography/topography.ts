import {
    Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { trigger, transition, animate, style, query, state } from '@angular/animations';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MapComponent } from '../../components/map/map';
import { CiteDialogComponent } from '../../components/cite-dialog/cite-dialog.component';

import { Store } from '@ngrx/store';
import * as fromTopography from '../../reducers';
import * as event from '../../actions/event';

import { Information } from '../../../information/models/information';

import { Event } from '../../models/event';

import { Moment } from 'moment';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

const SIDEPANEL_WIDTH = {
    'full': '75%',
    'short': '400px',
    'intro': '40%'
};

@Component({
    selector: 'cm-topography',
    templateUrl: './topography.html',
    styleUrls: ['./topography.scss'],
    animations: [
        trigger('sidenavIcon', [
            state('full', style({ transform: 'scaleX(1)' })),
            state('short', style({ transform: 'scaleX(-1)' })),
            transition('full <=> short', animate('300ms ease-in'))
        ]),
        trigger('sidenav', [
            state('full', style({ width: SIDEPANEL_WIDTH['full'] })),
            state('short', style({ width: SIDEPANEL_WIDTH['short'] })),
            state('intro', style({ width: SIDEPANEL_WIDTH['intro'] })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('timeline', [
            state('full', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH['full'] + ')' })),
            state('short', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH['short'] + ')' })),
            state('intro', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH['intro'] + ')' })),
            transition('* <=> *', animate('300ms ease-in'))
        ])
    ]
})
export class TopographyComponent implements OnInit, OnDestroy {
    events$: Observable<Event[]>;
    information$: Observable<Information>;
    filteredIdsSubscription: Subscription;
    selectedEventsSubscription: Subscription;
    filteredIds: string[] = [];
    selectedEvent: Event;
    nextEvent: Event;
    previousEvent: Event;
    sidepanelState = 'intro'; // full, short, intro
    sidepanelWidth: string;

    @ViewChild(MapComponent) map: MapComponent;

    public timelineHeight: number;

    constructor(
        private store: Store<fromTopography.State>,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
        this.route.queryParams.subscribe(queryParams => {
            if (queryParams['info']) {
                this.sidepanelState = queryParams['info'];
                this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
            }
        });

        this.events$ = this.store.select(fromTopography.getAllEvents);
        this.filteredIdsSubscription = this.store.select(fromTopography.getFilteredEventIds)
            .subscribe((ids: string[]) => this.filteredIds = ids);

        this.selectedEventsSubscription = this.store.select(fromTopography.getSelectedEvent)
            .subscribe((e) => {
                this.selectedEvent = e.current;
                this.nextEvent = e.next;
                this.previousEvent = e.previous;
                if (e.current) {
                    this.map.flyTo(e.current.coordinates);

                    if (this.sidepanelState === 'intro') {
                        this.sidepanelState = 'short';
                        this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
                    }
                } else {
                    this.sidepanelState = 'intro';
                    this.sidepanelWidth = SIDEPANEL_WIDTH['intro'];
                }
            });

        this.information$ = this.store.select(fromTopography.getSelectedInformation);
    }


    public showCite() {
        const dialogRef = this.dialog.open(CiteDialogComponent, {
            width: '250px',
            data: { event: this.selectedEvent }
        });
    }

    public updateTimeFilter(key: string, time: Moment) {
        let start = null;
        let end = null;

        if (key === 'start') {
            start = time;
        }
        if (key === 'end') {
            end = time;
        }

        this.store.dispatch(new event.SetTimeFilter({ start: start, end: end }));
    }

    public eventSelected(event: Event) {
        this.router.navigate(['/topography', 'events', event.id],
            { queryParamsHandling: 'preserve' });
    }

    public toggleInformationPanel() {
        if (this.sidepanelState === 'full') {
            this.sidepanelState = 'short';
            this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
            this.router.navigate([], { queryParams: { 'info': this.sidepanelState }, queryParamsHandling: 'merge' });
        } else {
            this.sidepanelState = 'full';
            this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
            this.router.navigate([], { queryParams: { 'info': this.sidepanelState }, queryParamsHandling: 'merge' });
            setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
        }
    }

    ngOnDestroy() {
        this.filteredIdsSubscription.unsubscribe();
        this.selectedEventsSubscription.unsubscribe();
    }

}
