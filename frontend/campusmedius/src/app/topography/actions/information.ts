import { Action } from '@ngrx/store';
import { Event } from '../models/event';

import { Information } from '../../shared/models/information';

// if information is lodaded
// SHOW -> SELECT
// if information is not loaded
// SHOW -> LOAD -> LOAD_COMPLETE -> SELECT

export const SHOW = '[Information] Show';
export const LOAD = '[Information] Load';
export const LOAD_COMPLETE = '[Information] Load complete';
export const LOAD_FAIL = '[Information] Load fail';
export const SELECT = '[Information] Select';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class Show implements Action {
    readonly type = SHOW;

    constructor(public payload: { informationId: string; resourceUrl: string; }) { }
}

export class Load implements Action {
    readonly type = LOAD;

    constructor(public payload: { informationId: string; resourceUrl: string; selectAfterLoad: boolean; }) { }
}

export class LoadComplete implements Action {
    readonly type = LOAD_COMPLETE;

    constructor(public payload: Information) { }
}

export class LoadFail implements Action {
    readonly type = LOAD_FAIL;

    constructor(public payload: any) { }
}

export class Select implements Action {
    readonly type = SELECT;

    constructor(public payload: { informationId: string; }) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = Show | Load | LoadComplete | LoadFail | Select;
