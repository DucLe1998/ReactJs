import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEvent = state => state.playback || initialState;

const makeSelectData = () =>
  createSelector(
    selectEvent,
    eventState => eventState.data,
  );

const makeSelectDataPlayback = () =>
  createSelector(
    selectEvent,
    eventState => eventState.dataPlayback,
  );

const makeSelectLoading = () =>
  createSelector(
    selectEvent,
    eventState => eventState.loading,
  );

const makeSelectIsReloading = () =>
  createSelector(
    selectEvent,
    eventState => eventState.isReloading,
  );

const makeSelectError = () =>
  createSelector(
    selectEvent,
    eventState => eventState.error,
  );

export {
  makeSelectError,
  makeSelectLoading,
  makeSelectData,
  makeSelectIsReloading,
  makeSelectDataPlayback,
};
