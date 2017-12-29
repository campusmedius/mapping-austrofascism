import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import * as fromTopography from '../../reducers';
import * as event from '../../actions/event';

import { Event } from '../../models/event';
import { Information } from '../../../shared/models/information';

import { Moment } from 'moment';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
    selector: 'cm-topography',
    templateUrl: './topography.html',
    styleUrls: ['./topography.scss']
})
export class TopographyComponent implements OnInit, OnDestroy {
    events$: Observable<Event[]>;
    filteredIdsSubscription: Subscription;
    selectedEventsSubscription: Subscription;
    filteredIds: string[] = [];
    selectedEvent: Event;
    nextEvent: Event;
    previousEvent: Event;
    information$: Observable<Information>;

    constructor(private store: Store<fromTopography.State>, private translate: TranslateService) {
        this.events$ = this.store.select(fromTopography.getAllEvents);
        this.filteredIdsSubscription = this.store.select(fromTopography.getFilteredEventIds)
            .subscribe((ids: string[]) => this.filteredIds = ids);
        this.selectedEventsSubscription = this.store.select(fromTopography.getSelectedEvents)
            .subscribe((e) => {
                this.selectedEvent = e.current;
                this.nextEvent = e.next;
                this.previousEvent = e.previous;
            });
        this.information$ = this.store.select(fromTopography.getSelectedInformation);
    }

    ngOnInit() {
        // this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
        //     console.log(e);
        // });

        this.store.dispatch(new event.Load());
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

    ngOnDestroy() {
        this.filteredIdsSubscription.unsubscribe();
        this.selectedEventsSubscription.unsubscribe();
    }

    eventSelected(selectedEvent: Event) {
        this.store.dispatch(new event.Select({ eventId: selectedEvent.id }));
    }

}
