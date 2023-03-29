import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the updatePassword state domain
 */

const selectUpdatePasswordDomain = state =>
  state.updatePassword || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UpdatePassword
 */
const makeSelectLoading = () =>
  createSelector(
    selectUpdatePasswordDomain,
    state => state.loading,
  );
const makeSelectApiMessage = () =>
  createSelector(
    selectUpdatePasswordDomain,
    state => state.apiMessage,
  );
const makeSelectError = () =>
  createSelector(
    selectUpdatePasswordDomain,
    state => state.error,
  );

export { makeSelectLoading, makeSelectApiMessage, makeSelectError };
