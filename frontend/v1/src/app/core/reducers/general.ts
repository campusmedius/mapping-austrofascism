import * as general from '../actions/general';

export interface State { }

export function reducer(state = {}, action: general.Actions): State {
    switch (action.type) {
        case general.ERROR:
            console.log(action.payload.message);

            return {};
        default:
            return state;
    }
}
