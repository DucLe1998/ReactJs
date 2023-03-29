import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the camAiConfigHumanFaceModule state domain
 */

const selectCamAiConfigHumanFaceModuleDomain = state =>
  state.camAiConfigHumanFaceModule || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CamAiConfigHumanFaceModule
 */

const makeSelectCamAiConfigHumanFaceModule = () =>
  createSelector(
    selectCamAiConfigHumanFaceModuleDomain,
    substate => substate,
  );

export default makeSelectCamAiConfigHumanFaceModule;
export { selectCamAiConfigHumanFaceModuleDomain };
