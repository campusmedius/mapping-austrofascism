import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from '../models/event';
import { environment } from '../../../environments/environment';

import * as moment from 'moment';

const CACHE_SIZE = 1;
const API_URL = environment.apiUrl;

@Injectable()
export class EventService {
    private cache$: Observable<Event[]>;

    constructor(private http: HttpClient) { }

    get events(): Observable<Event[]> {
        if (!this.cache$) {
            this.cache$ = this.requestEvents().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$;
    }

    event(id: string): Observable<Event> {
        return this.events.pipe(
            map((events: Event[]) => {
                return events.find(e => e.id === id);
            })
        );
    }

    private requestEvents(): Observable<Event[]> {
        return this.http
            .get(`${API_URL}/topography/events/?format=json`).pipe(
                map((data: Event[]) => {
                    data = data || [];
                    data.forEach(event => {
                        event.id = event.id + '';
                        event.previousEventId = event.previousEvent + '';
                        event.previousEvent = null;
                        event.nextEventId = event.nextEvent + '';
                        event.nextEvent = null;
                        event.informationId = event.informationId + '';
                        event.information = null;
                        event.start = moment(event.start);
                        event.end = moment(event.end);
                    });
                    return data;
                }));
    }
}

