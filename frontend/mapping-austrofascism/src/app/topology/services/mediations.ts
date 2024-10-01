import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env/environment';
import { Mediation} from '../models/mediation';

const CACHE_SIZE = 1;
const API_URL = environment.apiUrl;

@Injectable()
export class MediationService {
    private cache$: Observable<Mediation[]>;

    constructor(private http: HttpClient) { }

    get mediations(): Observable<Mediation[]> {
        if (!this.cache$) {
            this.cache$ = this.requestMediations().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$;
    }

    mediation(id: string): Observable<Mediation> {
        return this.mediations.pipe(
            map((mediations: Mediation[]) => {
                return mediations.find(m => m.id === id);
            })
        );
    }

    private requestMediations(): Observable<Mediation[]> {
        return this.http
            .get(`${API_URL}/topology/mediations/?format=json`).pipe(
                map((data: Mediation[]) => {
                    data = data || [];
                    data.forEach(mediation => {
                        mediation.id = mediation.id + '';
                        mediation.relations.forEach(m => {
                            m.id += '';
                            m.sourceId += '';
                            m.source = null;
                            m.targetId += '';
                            m.target = null;
                        });
                    });
                    return data;
                }));
    }
}

