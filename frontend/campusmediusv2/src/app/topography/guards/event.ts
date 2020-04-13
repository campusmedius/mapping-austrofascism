import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventService } from '../services/events';
import { InformationService } from '@app/information/services/information';
import { Event } from '../models/event';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class EventsResolver implements Resolve<Event[]> {
    constructor(private eventService: EventService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.eventService.events;
    }
}

@Injectable()
export class EventResolver implements Resolve<Event> {
    constructor(private eventService: EventService,
                private informationService: InformationService) { }

    resolve(route: ActivatedRouteSnapshot) {
        const id = route.paramMap.get('id');
        return this.eventService.event(id).pipe(
            switchMap(event => {
                return forkJoin({
                    previous: this.eventService.event(event.previousEventId),
                    next: this.eventService.event(event.nextEventId),
                    information: this.informationService.information(event.informationId)
                }).pipe(
                    map(results => {
                        event.previousEvent = results.previous;
                        event.nextEvent = results.next;
                        event.information = results.information;
                        return event;
                    })
                );
            })
        );
    }
}
