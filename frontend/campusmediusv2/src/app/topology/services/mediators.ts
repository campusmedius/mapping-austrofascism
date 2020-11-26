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
                        mediator.mediationId = Math.ceil(parseInt(mediator.id) / 5) + '';
                        if (mediator.mediationId === '0') {
                            mediator.mediationId = '1';
                        }
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
                        mediator.informationId = '15';
                        mediator.information = null;
                        mediator.created = moment(mediator.created);
                        mediator.updated = moment(mediator.updated);
                        mediator.time = moment(mediator.time);
                    });

                    this.setExaminingGazeDistanceAndTime(data);

                    return data;
                }));
    }

    private setExaminingGazeDistanceAndTime(mediators) {
      const m_1 = mediators.find(m => m.id === '6');
      const m_2 = mediators.find(m => m.id === '7');
      const m_3 = mediators.find(m => m.id === '8');
      const m_4 = mediators.find(m => m.id === '9');
      const m_5 = mediators.find(m => m.id === '10');

      mediators = [m_1, m_2, m_3, m_4, m_5];

      let distanceFromStart = 0;
      for (let i = 0; i < 4; i++) {
        mediators[i].distanceFromStart = distanceFromStart;
        distanceFromStart += mediators[i].relationsTo[0].spaceDifference;
      };
      mediators[4].distanceFromStart = distanceFromStart;

      let timeAfterEnd = 0;
      for (let i = 0; i < 4; i++) {
        mediators[i].timeAfterEnd = timeAfterEnd;
        timeAfterEnd -= mediators[i].relationsTo[0].timeDifference;
      };
      mediators[4].timeAfterEnd = timeAfterEnd;
    }
}
