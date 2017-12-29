import { Action } from '@ngrx/store';
import { Event } from '../models/event';

import { Moment } from 'moment';

export const SELECT = '[Event] Select';
export const LOAD = '[Event] Load';
export const LOAD_COMPLETE = '[Event] Load Complete';
export const LOAD_FAIL = '[Event] Load Fail';
export const SET_TIME_FILTER = '[Event] Set Time Filter';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class Load implements Action {
    readonly type = LOAD;

    constructor() { }
}

export class LoadComplete implements Action {
    readonly type = LOAD_COMPLETE;

    constructor(public payload: Event[]) { }
}

export class LoadFail implements Action {
    readonly type = LOAD_FAIL;

    constructor(public payload: any) { }
}

export class Select implements Action {
    readonly type = SELECT;

    constructor(public payload: { eventId: string; }) { }
}

export class SetTimeFilter implements Action {
    readonly type = SET_TIME_FILTER;

    constructor(public payload: { start: Moment, end: Moment }) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = Load | LoadComplete | LoadFail | Select | SetTimeFilter;
