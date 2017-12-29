import * as layout from '../actions/layout';

export interface State {
    showAbout: boolean;
}

const initialState: State = {
    showAbout: false,
};

export function reducer(state = initialState, action: layout.Actions): State {
    switch (action.type) {
        case layout.CLOSE_ABOUT:
            return {
                showAbout: false,
            };

        case layout.OPEN_ABOUT:
            return {
                showAbout: true,
            };

        default:
            return state;
    }
}

export const getShowAbout = (state: State) => state.showAbout; 
