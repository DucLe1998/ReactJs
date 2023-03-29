import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEvent = state => state.ListItem || initialState;

const makeSelectListItems = () =>
  createSelector(
    selectEvent,
    eventState => eventState.dataItems,
  );

const makeSelectLoading = () =>
  createSelector(
    selectEvent,
    eventState => eventState.loading,
  );

const makeSelectListType = () =>
  createSelector(
    selectEvent,
    eventState => eventState.listType,
  );

const makeSelectListColor = () =>
  createSelector(
    selectEvent,
    eventState => eventState.listColor,
  );

const makeSelectError = () =>
  createSelector(
    selectEvent,
    eventState => eventState.error,
  );

export {
  makeSelectError,
  makeSelectLoading,
  makeSelectListItems,
  makeSelectListType,
  makeSelectListColor,
};
