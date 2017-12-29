import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Information } from '../../shared/models/information';
import * as information from '../actions/information';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Information> {
    selectedInformationId: string | null;
    loading: boolean;
}

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Information> = createEntityAdapter<Information>({
    selectId: (i: Information) => i.id,
    sortComparer: false,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
*/
export const initialState: State = adapter.getInitialState({
    selectedInformationId: null,
    loading: false
});

export function reducer(state = initialState, action: information.Actions): State {
    switch (action.type) {
        case information.LOAD: {
            return {
                ...state,
                loading: true
            };
        }
        case information.LOAD_COMPLETE: {
            return {
                ...adapter.addOne(action.payload, state),
                loading: false
            };
        }
        case information.SELECT: {
            return {
                ...state,
                selectedInformationId: action.payload.informationId
            };
        }
        default: {
            return state;
        }
    }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getSelectedId = (state: State) => state.selectedInformationId;
export const getLoading = (state: State) => state.loading;
