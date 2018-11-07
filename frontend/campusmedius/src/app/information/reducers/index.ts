import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromInformation from './information';
import { selectRouteInfo } from '../../core/reducers';
import { Information } from '../models/information';

export interface InformationState {
    information: fromInformation.State;
}

export interface State {
    'information': InformationState;
}

export const reducers = {
    information: fromInformation.reducer
};

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = state$.select(getBooksState);
 * 	}
 * }
 * ```
 */

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
*/
export const getInformationState = createFeatureSelector<InformationState>('information');

// information state
export const getInformationEntitiesState = createSelector(
    getInformationState,
    state => state.information
);

export const {
    selectIds: getInformationIds,
    selectEntities: getInformationEntities,
    selectAll: getAllInformations,
    selectTotal: getTotalInformations,
} = fromInformation.adapter.getSelectors(getInformationEntitiesState);
