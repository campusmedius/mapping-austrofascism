import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Page } from '../models/page';
import { InformationService } from '../services/information';
import { PageService } from '../services/page';

@Injectable()
export class PagesResolver implements Resolve<Page[]> {
    constructor(private PageService: PageService,
                private informationService: InformationService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return forkJoin({
            pages: this.PageService.pages,
            informations: this.informationService.informations
        }).pipe(
            map(results => {
                results.pages.forEach(p => {
                    p.information = results.informations.find(i => i.id === p.informationId);
                });
                return results.pages;
            })
        );
    }
}
