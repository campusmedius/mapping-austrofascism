import { Action } from '@ngrx/store';
import { Event } from '../models/event';

import { Moment } from 'moment';

export const ADD_EVENTS = '[Event] Add events';
export const SET_TIME_FILTER = '[Event] Set Time Filter';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */


export class AddEvents implements Action {
    readonly type = ADD_EVENTS;

    constructor(public payload: Event[]) { }
}


export class SetTimeFilter implements Action {
    readonly type = SET_TIME_FILTER;

    constructor(public payload: { start: Moment, end: Moment }) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = AddEvents | SetTimeFilter;
