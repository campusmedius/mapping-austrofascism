import { Action } from '@ngrx/store';
import { Page } from '../models/page';


export const ADD_PAGES = '[Page] Add pages';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */


export class AddPages implements Action {
    readonly type = ADD_PAGES;

    constructor(public payload: Page[]) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = AddPages;
