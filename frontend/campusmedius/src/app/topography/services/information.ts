import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Information } from '../../shared/models/information';


@Injectable()
export class InformationService {
    private API_PATH = 'http://localhost:8000/information/';

    constructor(private http: HttpClient) { }

    getInformations(): Observable<Information[]> {
        return this.http
            .get(`${this.API_PATH}/informations?format=json`)
            .map((data: Information[]) => {
                data = data || [];
                data.forEach(information => {
                    information.id = information.id + '';
                });
                return data;
            });
    }

    getInformationByResourceUrl(url: string): Observable<Information> {
        return this.http
            .get(url)
            .map((information: Information) => {
                if (!information) {
                    throw Error('information data empty');
                }
                information.id = information.id + '';
                return information;
            });
    }
}
