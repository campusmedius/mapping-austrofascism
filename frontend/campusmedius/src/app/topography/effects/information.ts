import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTopography from '../reducers';

import { InformationService } from '../services/information';
import * as information from '../actions/information';

import { Information } from '../../shared/models/information';


/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application.
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class InformationEffects {
    @Effect()
    show$: Observable<Action> = this.actions$
        .ofType<information.Show>(information.SHOW)
        .withLatestFrom(this.store$, (action: information.Show, state: fromTopography.State) => {
            const info = state.topography.information.entities[action.payload.informationId];
            if (info) {
                return new information.Select({ informationId: info.id });
            } else {
                return new information.Load({
                    informationId: action.payload.informationId,
                    resourceUrl: action.payload.resourceUrl,
                    selectAfterLoad: true
                });
            }
        });


    @Effect()
    load$: Observable<Action> = this.actions$
        .ofType<information.Load>(information.LOAD)
        .switchMap(loadAction => {
            return this.informationService.getInformationByResourceUrl(loadAction.payload.resourceUrl)
                .map((result: Information) => new information.LoadComplete(result))
                .mergeMap((loadCompleteAction: information.LoadComplete) => {
                    const returnActions: any[] = [loadCompleteAction];
                    if (loadAction.payload.selectAfterLoad) {
                        returnActions.push(new information.Select({ informationId: loadCompleteAction.payload.id }));
                    }
                    return returnActions;
                })
                .catch(error => of(new information.LoadFail(error)));
        });

    constructor(private actions$: Actions, private store$: Store<fromTopography.State>, private informationService: InformationService) { }
}
