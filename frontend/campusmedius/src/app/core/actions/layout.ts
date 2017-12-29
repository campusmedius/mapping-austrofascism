import { Action } from '@ngrx/store';

export const OPEN_ABOUT = '[Layout] Open About';
export const CLOSE_ABOUT = '[Layout] Close About';

export class OpenAbout implements Action {
    readonly type = OPEN_ABOUT;
}

export class CloseAbout implements Action {
    readonly type = CLOSE_ABOUT;
}

export type Actions = OpenAbout | CloseAbout;
