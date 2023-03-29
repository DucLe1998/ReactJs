import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the mapIndoorManagement state domain
 */

const selectMapIndoorManagementDomain = state =>
  state.mapIndoorManagement || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MapIndoorManagement
 */

const makeSelectMapIndoorManagement = () =>
  createSelector(
    selectMapIndoorManagementDomain,
    substate => substate,
  );

export default makeSelectMapIndoorManagement;
export { selectMapIndoorManagementDomain };
