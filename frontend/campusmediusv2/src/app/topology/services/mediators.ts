import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';
import { environment } from '@env/environment';
import { Mediator } from '../models/mediator';

const CACHE_SIZE = 1;
const API_URL = environment.apiUrl;

@Injectable()
export class MediatorService {
    private cache$: Observable<Mediator[]>;

    constructor(private http: HttpClient) { }

    get mediators(): Observable<Mediator[]> {
        if (!this.cache$) {
            this.cache$ = this.requestMediators().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$;
    }

    mediator(id: string): Observable<Mediator> {
        return this.mediators.pipe(
            map((mediators: Mediator[]) => {
                return mediators.find(m => m.id === id);
            })
        );
    }

    private requestMediators(): Observable<Mediator[]> {
        return this.http
            .get(`${API_URL}/topology/mediators/?format=json`).pipe(
                map((data: Mediator[]) => {
                    data = data || [];
                    data.forEach(mediator => {
                        mediator.id = mediator.id + '';
                        mediator.relationsFrom.forEach(m => {
                            m.id += '';
                            m.sourceId += '';
                            m.source = null;
                            m.targetId += '';
                            m.target = null;
                        });
                        mediator.relationsTo.forEach(m => {
                            m.id += '';
                            m.sourceId += '';
                            m.source = null;
                            m.targetId += '';
                            m.target = null;
                        });
                        mediator.informationId += '';
                        mediator.information = null;
                        mediator.created = moment(mediator.created);
                        mediator.updated = moment(mediator.updated);
                    });
                    return data;
                }));
    }
}

