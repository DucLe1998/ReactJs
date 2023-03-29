import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the profile state domain
 */

const selectEvent = state => state.profile || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Profile
 */

const makeSelectProfile = () =>
  createSelector(
    selectEvent,
    substate => substate.profile,
  );

const makeSelectLoading = () =>
  createSelector(
    selectEvent,
    substate => substate.loading,
  );

export { makeSelectProfile, makeSelectLoading };
