import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap, delay, withLatestFrom } from 'rxjs/operators';
import { getEventsPagesLoaded } from '../reducers';
import { AddEvents } from '../actions/event';
import { AddPages } from '../actions/page';
import { EventService } from '../services/events';
import { PageService } from '../services/pages';
import { AddInformation } from '../../information/actions/information';
import { InformationService } from '../../information/services/information';

@Injectable()
export class AboutTeamResolver implements Resolve<boolean> {
    constructor(
        private store: Store<any>,
        private eventService: EventService,
        private pageService: PageService,
        private informationService: InformationService) { }

    waitForPageLoaded(page): Observable<any> {
        return this.store.pipe(
            select(getEventsPagesLoaded),
            switchMap((loaded: { eventsLoaded: boolean, pagesLoaded: boolean }) => {
                if (loaded.eventsLoaded && loaded.pagesLoaded) {
                    return of(true);
                } else {
                    const observables = [];
                    if (!loaded.eventsLoaded) {
                        observables.push(this.eventService.getEvents().pipe(
                            map(data => {
                                this.store.dispatch(new AddEvents(data));
                                return true;
                            })
                        ));
                    }
                    if (!loaded.pagesLoaded) {
                        observables.push(this.pageService.getPages().pipe(
                            map(data => {
                                this.store.dispatch(new AddPages(data));
                                return true;
                            })
                        ));
                    }
                    return forkJoin(observables).pipe(map((results) => {
                        return true;
                    }));
                }
            }),
            withLatestFrom(this.store),
            switchMap(([loaded, state]) => {
                if (!loaded) {
                    return of(false);
                }

                if (page === 'about') {
                    const informationId = state.topography.pages.entities['1'].informationId;
                    if (!state.information.information.entities[informationId]) {
                        return this.informationService.getInformation('18').pipe(
                            map(data => {
                                data.id = 'about';
                                this.store.dispatch(new AddInformation(data));
                                return true;
                            })
                        );
                    } else {
                        const page = state.topography.pages.entities['2'];
                        this.store.dispatch(new AddInformation({
                            id: 'team',
                            titleDe: page.titleDe,
                            titleEn: page.titleEn,
                            contentDe: page.contentDe,
                            contentEn: page.contentEn,
                            media: {
                                images: {},
                                videos: {},
                                audios: {},
                                galleries: {}
                            }
                        }));
                        return of(true);
                    }
                }
                if (page === 'team') {
                    return of(true);
                }
            }),
            take(1)
        );
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const page = route.url[0].path;
        return this.waitForPageLoaded(page).pipe(
            catchError(error => {
                console.log('Cant fetch Events');
                return of(false);
            })
        );
    }
}
