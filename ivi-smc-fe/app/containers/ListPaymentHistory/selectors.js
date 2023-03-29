import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listPaymentHistory state domain
 */

const selectListPaymentHistoryDomain = state =>
  state.listPaymentHistory || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListPaymentHistory
 */

const makeSelectListPaymentHistory = () =>
  createSelector(
    selectListPaymentHistoryDomain,
    substate => substate,
  );

export default makeSelectListPaymentHistory;
export { selectListPaymentHistoryDomain };
