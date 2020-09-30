import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Page } from '../models/page';
import { environment } from '../../../environments/environment';
import { map, shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;
const API_URL = environment.apiUrl;

@Injectable()
export class PageService {
    private cache$: Observable<Page[]>;

    constructor(private http: HttpClient) { }

    get pages(): Observable<Page[]> {
        if (!this.cache$) {
            this.cache$ = this.requestPages().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$;
    }

    page(id: string): Observable<Page> {
        return this.pages.pipe(
            map((pages: Page[]) => {
                return pages.find(i => i.id === id);
            })
        );
    }

    private requestPages(): Observable<Page[]> {
        return this.http
            .get(`${API_URL}/main/pages/?format=json`).pipe(
                map((data: Page[]) => {
                    data = data || [];
                    data.forEach(page => {
                        page.id = page.id + '';
                        page.informationId = page.informationId + '';
                        page.information = null;
                    });
                    return data;
                }));
    }
}
