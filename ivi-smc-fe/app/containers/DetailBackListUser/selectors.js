import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the detailBackListUser state domain
 */

const selectDetailBackListUserDomain = state =>
  state.detailBackListUser || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DetailBackListUser
 */

const makeSelectDetailBackListUser = () =>
  createSelector(
    selectDetailBackListUserDomain,
    substate => substate,
  );

export default makeSelectDetailBackListUser;
export { selectDetailBackListUserDomain };
