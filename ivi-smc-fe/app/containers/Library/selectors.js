import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the library state domain
 */

const selectLibraryDomain = state => state.library || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Library
 */

const makeSelectLibrary = () =>
  createSelector(
    selectLibraryDomain,
    substate => substate,
  );

export default makeSelectLibrary;
export { selectLibraryDomain };
