import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEvent = state => state.roomDeviceType || initialState;

const makeSelectListData = () =>
  createSelector(
    selectEvent,
    ComponentState => ComponentState.listData,
  );

const makeSelectLoading = () =>
  createSelector(
    selectEvent,
    ComponentState => ComponentState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectEvent,
    ComponentState => ComponentState.error,
  );

const makeSelectEditingItem = () =>
  createSelector(
    selectEvent,
    ComponentState => ComponentState.editingItem,
  );

export {
  makeSelectError,
  makeSelectListData,
  makeSelectLoading,
  makeSelectEditingItem,
};
