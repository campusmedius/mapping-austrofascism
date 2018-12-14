import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Event } from '../models/event';
import * as event from '../actions/event';
import { Moment } from 'moment';
import * as moment from 'moment';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Event> {
    timeFilter: { start: Moment; end: Moment; };
    loaded: boolean;
}

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Event> = createEntityAdapter<Event>({
    sortComparer: false
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
*/
export const initialState: State = adapter.getInitialState({
    timeFilter: { start: moment('1933-05-13T13:00Z'), end: moment('1933-05-14T13:00Z') },
    loaded: false
});

export function reducer(state = initialState, action: event.Actions): State {
    switch (action.type) {
        case event.ADD_EVENTS: {
            return {
                /**
                 * The addMany function provided by the created adapter
                 * adds many records to the entity dictionary
                 * and returns a new state including those records. If
                 * the collection is to be sorted, the adapter will
                 * sort each record upon entry into the sorted array.
                 */
                ...adapter.addMany(action.payload, state),
                loaded: true
            };
        }
        case event.SET_TIME_FILTER: {
            let timeFilterStart = action.payload.start;
            let timeFilterEnd = action.payload.end;

            if (!timeFilterStart) {
                timeFilterStart = state.timeFilter.start;
            }
            if (!timeFilterEnd) {
                timeFilterEnd = state.timeFilter.end;
            }

            return {
                ...state,
                timeFilter: { start: timeFilterStart, end: timeFilterEnd }
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

export const getTimeFilter = (state: State) => state.timeFilter;
export const getLoaded = (state: State) => state.loaded;
