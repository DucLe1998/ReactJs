import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEvent = state => state.nvr || initialState;

const makeSelectListData = () =>
  createSelector(
    selectEvent,
    nvrState => nvrState.listData,
  );

const makeSelectLoading = () =>
  createSelector(
    selectEvent,
    nvrState => nvrState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectEvent,
    nvrState => nvrState.error,
  );

const makeSelectEditingItem = () =>
  createSelector(
    selectEvent,
    nvrState => nvrState.editingItem,
  );

export {
  makeSelectError,
  makeSelectListData,
  makeSelectLoading,
  makeSelectEditingItem,
};
