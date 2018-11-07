import { Action } from '@ngrx/store';

import { Information } from '../models/information';

export const ADD_INFORMATION = '[Information] Add information';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class AddInformation implements Action {
    readonly type = ADD_INFORMATION;

    constructor(public payload: Information) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = AddInformation;
