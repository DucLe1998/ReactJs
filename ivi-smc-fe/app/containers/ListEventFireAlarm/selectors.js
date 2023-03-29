import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listEventFireAlarm state domain
 */

const selectListEventFireAlarmDomain = state =>
  state.listEventFireAlarm || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListEventFireAlarm
 */

const makeSelectListEventFireAlarm = () =>
  createSelector(
    selectListEventFireAlarmDomain,
    substate => substate,
  );

export default makeSelectListEventFireAlarm;
export { selectListEventFireAlarmDomain };
