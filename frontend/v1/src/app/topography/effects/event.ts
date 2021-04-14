import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTopography from '../reducers';

import { EventService } from '../services/events';
import * as event from '../actions/event';
import * as general from '../../core/actions/general';
import { Event } from '../models/event';

import { getIdFromResourceUrl } from '../../shared/utils';

import * as moment from 'moment';

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
export class EventEffects {
    // @Effect()
    // load$: Observable<Action> = this.actions$
    //     .ofType<event.Load>(event.LOAD)
    //     .switchMap(action => {
    //         return this.eventService.getEvents()
    //             .map((events: Event[]) => new event.LoadComplete(events))
    //             .catch(error => of(new event.LoadFail(error)));
    //     });

    // @Effect()
    // select$: Observable<Action> = this.actions$
    //     .ofType<event.Select>(event.SELECT)
    //     .withLatestFrom(this.store$, (action: event.Select, state: fromTopography.State) => {
    //         const selectedEvent = state.topography.events.entities[action.payload.eventId];

    //         if (!selectedEvent.information) {
    //             alert('No information linked');
    //             return new general.Error({ message: 'No information linked' });
    //         }

    //         const url = selectedEvent.information;
    //         const id = getIdFromResourceUrl(url);
    //         return new information.Show({ informationId: id, resourceUrl: url });
    //     });

    constructor(private actions$: Actions, private store$: Store<fromTopography.State>, private eventService: EventService) { }
}
