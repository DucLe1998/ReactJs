import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEvent = state => state.newmanagement || initialState;

const makeSelectData = () =>
  createSelector(
    selectEvent,
    eventState => eventState.data,
  );

const makeSelectDataDetail = () =>
  createSelector(
    selectEvent,
    eventState => eventState.dataDetail,
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
  makeSelectDataDetail,
};
