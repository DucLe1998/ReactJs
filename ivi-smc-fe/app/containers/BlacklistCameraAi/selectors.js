import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the blacklistCameraAi state domain
 */

const selectBlacklistCameraAiDomain = state =>
  state.blacklistCameraAi || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by BlacklistCameraAi
 */

const makeSelectBlacklistCameraAi = () =>
  createSelector(
    selectBlacklistCameraAiDomain,
    substate => substate,
  );

export default makeSelectBlacklistCameraAi;
export { selectBlacklistCameraAiDomain };
