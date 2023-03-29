import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listWarning state domain
 */

const selectListWarningDomain = state => state.listWarning || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListWarning
 */

const makeSelectListWarning = () =>
  createSelector(
    selectListWarningDomain,
    substate => substate,
  );

export default makeSelectListWarning;
export { selectListWarningDomain };
