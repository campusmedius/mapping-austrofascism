import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap, delay, withLatestFrom } from 'rxjs/operators';
import { getEventsLoaded } from '../reducers';
import { AddEvents } from '../actions/event';
import { EventService } from '../services/events';
import { AddInformation } from '../../information/actions/information';
import { InformationService } from '../../information/services/information';

@Injectable()
export class EventResolver implements Resolve<boolean> {
    constructor(
        private store: Store<any>,
        private eventService: EventService,
        private informationService: InformationService) { }

    waitForEventsLoaded(eventId): Observable<any> {
        return this.store.pipe(
            select(getEventsLoaded),
            switchMap((eventsLoaded: boolean) => {
                if (eventsLoaded) {
                    return of(true);
                } else {
                    return this.eventService.getEvents().pipe(
                        map(data => {
                            this.store.dispatch(new AddEvents(data));
                            return true;
                        })
                    );
                }
            }),
            withLatestFrom(this.store),
            switchMap(([eventsLoaded, state]) => {
                if (!eventsLoaded) {
                    return of(false);
                }

                if (eventId) {
                    const informationId = state.topography.events.entities[eventId].informationId;
                    if (!state.information.information.entities[informationId]) {
                        return this.informationService.getInformation(informationId).pipe(
                            map(data => {
                                this.store.dispatch(new AddInformation(data));
                                return true;
                            })
                        );
                    } else {
                        return of(true);
                    }
                } else {
                    return of(true);
                }
            }),
            take(1)
        );
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const eventId = route.paramMap.get('eventId');
        return this.waitForEventsLoaded(eventId).pipe(
            catchError(error => {
                console.log('Cant fetch Events');
                return of(false);
            })
        );
    }
}
