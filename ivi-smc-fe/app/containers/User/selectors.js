import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the user state domain
 */

const selectEvent = state => state.user || initialState;

const makeSelectUser = () =>
  createSelector(
    selectEvent,
    substate => substate.users,
  );

const makeSelectLoading = () =>
  createSelector(
    selectEvent,
    eventState => eventState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectEvent,
    eventState => eventState.error,
  );

const makeSelectUnits = () =>
  createSelector(
    selectEvent,
    substate => substate.units,
  );

const makeSelectPositions = () =>
  createSelector(
    selectEvent,
    substate => substate.positions,
  );

const makeSelectAuthorities = () =>
  createSelector(
    selectEvent,
    substate => substate.authorities,
  );

const makeGetUser = () =>
  createSelector(
    selectEvent,
    substate => substate.user,
  );

const makeLoadDVKN = () =>
  createSelector(
    selectEvent,
    substate => substate.DVKN,
  );

// export default makeSelectUser;
export {
  selectEvent,
  makeSelectLoading,
  makeSelectError,
  makeSelectUser,
  makeSelectUnits,
  makeSelectPositions,
  makeSelectAuthorities,
  makeGetUser,
  makeLoadDVKN,
};
