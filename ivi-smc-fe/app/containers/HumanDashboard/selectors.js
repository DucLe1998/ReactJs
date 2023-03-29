import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the humanDashboard state domain
 */

const selectHumanDashboardDomain = state =>
  state.humanDashboard || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HumanDashboard
 */

const makeSelectHumanDashboard = () =>
  createSelector(
    selectHumanDashboardDomain,
    substate => substate,
  );

export default makeSelectHumanDashboard;
export { selectHumanDashboardDomain };
