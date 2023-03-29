import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the guestDashboard state domain
 */

const selectGuestDashboardDomain = state =>
  state.guestDashboard || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by GuestDashboard
 */

const makeSelectGuestDashboard = () =>
  createSelector(
    selectGuestDashboardDomain,
    substate => substate,
  );

export default makeSelectGuestDashboard;
export { selectGuestDashboardDomain };
