import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEvent = state => state.IntrusionCameraAi || initialState;

const makeSelectData = () =>
  createSelector(
    selectEvent,
    eventState => eventState.data,
  );

const makeForm = () =>
  createSelector(
    selectEvent,
    eventState => eventState.form,
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

export { makeSelectError, makeSelectLoading, makeSelectData, makeForm };
