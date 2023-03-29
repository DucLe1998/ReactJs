import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMenu = state => state.listMenu || initialState;

const makeSelectListMenu = () =>
  createSelector(
    selectMenu,
    menuState => menuState.listMenu,
  );
const makeSelectListParentMenu = () =>
  createSelector(
    selectMenu,
    menuState => menuState.listParentMenu,
  );

const makeSelectLoading = () =>
  createSelector(
    selectMenu,
    menuState => menuState.loading,
  );
const makeSelectError = () =>
  createSelector(
    selectMenu,
    selectMenu => selectMenu.error,
  );

export {
  makeSelectError,
  makeSelectListMenu,
  makeSelectListParentMenu,
  makeSelectLoading,
};
