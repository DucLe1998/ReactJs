import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the camAiConfigMissingItemModule state domain
 */

const selectCamAiConfigMissingItemModuleDomain = state =>
  state.camAiConfigMissingItemModule || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CamAiConfigMissingItemModule
 */

const makeSelectCamAiConfigMissingItemModule = () =>
  createSelector(
    selectCamAiConfigMissingItemModuleDomain,
    substate => substate,
  );

export default makeSelectCamAiConfigMissingItemModule;
export { selectCamAiConfigMissingItemModuleDomain };
