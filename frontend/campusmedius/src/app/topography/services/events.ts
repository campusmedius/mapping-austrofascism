import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Event } from '../models/event';

import * as moment from 'moment';

@Injectable()
export class EventService {
    private API_PATH = 'http://localhost:8000/topography/events/';

    constructor(private http: HttpClient) { }

    getEvents(): Observable<Event[]> {
        return this.http
            .get(`${this.API_PATH}?format=json`)
            .map((data: Event[]) => {
                data = data || [];
                data.forEach(event => {
                    event.id = event.id + '';
                    event.start = moment(event.start);
                    event.end = moment(event.end);
                    event.information = 'http://localhost:8000/information/informations/1/';
                });
                return data;
            });
    }
}
