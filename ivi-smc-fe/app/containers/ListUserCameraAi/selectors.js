import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listUserCameraAi state domain
 */

const selectListUserCameraAiDomain = state =>
  state.listUserCameraAi || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListUserCameraAi
 */

const makeSelectListUserCameraAi = () =>
  createSelector(
    selectListUserCameraAiDomain,
    substate => substate,
  );

export default makeSelectListUserCameraAi;
export { selectListUserCameraAiDomain };
