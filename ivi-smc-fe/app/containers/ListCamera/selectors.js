import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listCamera state domain
 */

const selectListCameraDomain = state => state.listCamera || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListCamera
 */

const makeSelectListCamera = () =>
  createSelector(
    selectListCameraDomain,
    substate => substate,
  );

export default makeSelectListCamera;
export { selectListCameraDomain };
