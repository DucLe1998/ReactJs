import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectParking = state => state.notification || initialState;

const makeSelectListNotification = () =>
  createSelector(
    selectParking,
    deviceState => deviceState.listNotification,
  );

const makeSelectLoading = () =>
  createSelector(
    selectParking,
    deviceState => deviceState.loading,
  );
const makeSelectError = () =>
  createSelector(
    selectParking,
    state => state.error,
  );

export { makeSelectError, makeSelectListNotification, makeSelectLoading };
