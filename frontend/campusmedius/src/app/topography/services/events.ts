import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Event } from '../models/event';
import { environment } from '../../../environments/environment';

import * as moment from 'moment';

@Injectable()
export class EventService {
    private API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getEvents(): Observable<Event[]> {
        return this.http
            .get(`${this.API_URL}/topography/events?format=json`)
            .map((data: Event[]) => {
                data = data || [];
                data.forEach(event => {
                    event.id = event.id + '';
                    event.start = moment(event.start);
                    event.end = moment(event.end);
                    event.information = `${this.API_URL}/information/informations/1?format=json`;
                });
                return data;
            });
    }
}
