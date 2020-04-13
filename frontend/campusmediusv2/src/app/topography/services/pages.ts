
import { of ,  Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Page } from '../models/page';
import { environment } from '../../../environments/environment';

@Injectable()
export class PageService {
    private API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getPages(): Observable<Page[]> {
        return this.http
            .get(`${this.API_URL}/main/pages?format=json`).pipe(
            map((data: Page[]) => {
                data = data || [];
                data.forEach(event => {
                    event.id = event.id + '';
                });
                return data;
            }));
    }
}
