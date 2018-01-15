import { Action } from '@ngrx/store';

export const ERROR = '[General] Error';

export class Error implements Action {
    readonly type = ERROR;

    constructor(public payload: { message: string; }) { }
}

export type Actions = Error;
