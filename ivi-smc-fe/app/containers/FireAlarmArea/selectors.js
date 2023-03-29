import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the fireAlarmArea state domain
 */

const selectFireAlarmAreaDomain = state => state.fireAlarmArea || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by FireAlarmArea
 */

const makeSelectFireAlarmArea = () =>
  createSelector(
    selectFireAlarmAreaDomain,
    substate => substate,
  );

export default makeSelectFireAlarmArea;
export { selectFireAlarmAreaDomain };
