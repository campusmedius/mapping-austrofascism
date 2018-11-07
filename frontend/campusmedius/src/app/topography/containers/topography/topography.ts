import {
    Component, OnInit, OnDestroy, Input
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { trigger, transition, animate, style, query, state } from '@angular/animations';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import * as fromTopography from '../../reducers';
import * as event from '../../actions/event';

import { Information } from '../../../information/models/information';

import { Event } from '../../models/event';

import { Moment } from 'moment';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
    selector: 'cm-topography',
    templateUrl: './topography.html',
    styleUrls: ['./topography.scss'],
    animations: [
        trigger('sidenavControl', [
            state('true', style({ transform: 'scaleX(1)' })),
            state('false', style({ transform: 'scaleX(-1)' })),
            transition('false <=> true', animate('300ms ease-in'))
        ]),
        trigger('sidenav', [
            state('true', style({ width: '75%' })),
            state('false', style({ width: '440px' })),
            transition('false <=> true', animate('300ms ease-in'))
        ]),
        trigger('timeline', [
            state('true', style({ width: '25%' })),
            state('false', style({ width: 'calc(100vw - 440px)' })),
            transition('false <=> true', animate('300ms ease-in'))
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
    sidenavOpened = false;

    constructor(
        private store: Store<fromTopography.State>,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        // this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
        //     console.log(e);
        // });

        this.route.queryParams.subscribe(queryParams => {
            if (queryParams['info']) {
                if (queryParams['info'] === 'full') {
                    this.sidenavOpened = true;
                } else {
                    this.sidenavOpened = false;
                }
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
            });

        this.information$ = this.store.select(fromTopography.getSelectedInformation);
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
        if (this.sidenavOpened) {
            this.router.navigate([], { queryParams: { 'info': 'short' }, queryParamsHandling: 'merge' });
        } else {
            this.router.navigate([], { queryParams: { 'info': 'full' }, queryParamsHandling: 'merge' });
        }
    }

    ngOnDestroy() {
        this.filteredIdsSubscription.unsubscribe();
        this.selectedEventsSubscription.unsubscribe();
    }

}
