import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEvent = state => state.policy || initialState;

const makeSelectPolicy = () =>
  createSelector(
    selectEvent,
    eventState => eventState,
  );
const makeSelectResource = () =>
  createSelector(
    selectEvent,
    eventState => eventState.listResource,
  );
const makeSelectMenuDetail = () =>
  createSelector(
    selectEvent,
    eventState => eventState.listMenuDetail,
  );
const makeSelectLoading = () =>
  createSelector(
    selectEvent,
    eventState => eventState.loading,
  );
const makeSelectDetailPolicy = () =>
  createSelector(
    selectEvent,
    eventState => eventState.detailPolicy,
  );
const makeSelectError = () =>
  createSelector(
    selectEvent,
    eventState => eventState.error,
  );

export default makeSelectPolicy;

export {
  makeSelectError,
  makeSelectLoading,
  makeSelectResource,
  makeSelectDetailPolicy,
  makeSelectMenuDetail,
};
