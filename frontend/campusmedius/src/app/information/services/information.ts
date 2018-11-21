import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Information } from '..//models/information';
import { environment } from '../../../environments/environment';

// import media from './media.json';
// import template from './template.html';

@Injectable()
export class InformationService {
    private API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getInformations(): Observable<Information[]> {
        return this.http
            .get(`${this.API_URL}/information/informations?format=json`)
            .map((data: Information[]) => {
                data = data || [];
                data.forEach(information => {
                    information.id = information.id + '';
                });
                return data;
            });
    }

    getInformation(id: string): Observable<Information> {
        return this.http
            .get(`${this.API_URL}/information/informations/1/?format=json`)
            .map((data: Information) => {
                data.id = id;
                data.id += '';
                // data.contentEn = template;
                // data.contentDe = template;
                // data.media = <any>media;
                return data;
            });
    }

}



