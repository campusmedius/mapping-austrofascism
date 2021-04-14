import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Page } from '../models/page';
import { environment } from '../../../environments/environment';

@Injectable()
export class PageService {
    private API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getPages(): Observable<Page[]> {
        return this.http
            .get(`${this.API_URL}/main/pages?format=json`)
            .map((data: Page[]) => {
                data = data || [];
                data.forEach(event => {
                    event.id = event.id + '';
                });
                return data;
            });
    }
}
