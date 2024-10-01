import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Information } from '../models/information';
import { environment } from '../../../environments/environment';
import { map, shareReplay } from 'rxjs/operators';

// for debug
// import media from './media.json';
// import template from './template.html';

const CACHE_SIZE = 1;
const API_URL = environment.apiUrl;

@Injectable()
export class InformationService {
    private cache$: Observable<Information[]>;

    constructor(private http: HttpClient) { }

    get informations(): Observable<Information[]> {
        if (!this.cache$) {
            this.cache$ = this.requestInformations().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$;
    }

    information(id: string): Observable<Information> {
        return this.informations.pipe(
            map((informations: Information[]) => {
                return informations.find(i => i.id === id);
            })
        );
    }

    private requestInformations(): Observable<Information[]> {
        return this.http
            .get(`${API_URL}/information/informations/?format=json`).pipe(
                map((data: Information[]) => {
                    data = data || [];
                    data.forEach(information => {
                        information.id = information.id + '';
                    });
                    return data;
                }));
    }
}
