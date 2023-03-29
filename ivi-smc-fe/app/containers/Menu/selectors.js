/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMenu = state => state.usermenu || initialState;
const makeSideBarOpen = () => {
  createSelector(
    selectMenu,
    menuState => menuState.sideMenuOpened,
  );
};
const makeSelectUserMenu = () =>
  createSelector(
    selectMenu,
    menuState => menuState.userMenus,
  );
const makeSelectIsDataLoaded = () =>
  createSelector(
    selectMenu,
    menuState => menuState.menuLoaded,
  );
const makeSelectIsAuthorityLoaded = () =>
  createSelector(
    selectMenu,
    menuState => menuState.isAuthorityLoaded,
  );
const makeSelectUserMenuRawData = () =>
  createSelector(
    selectMenu,
    homeState => homeState.userMenusRawData,
  );
// const makeSelectUserAuthority = page =>
//   createSelector(
//     selectMenu,
//     menuState => menuState.listUserAuthority[page],
//   );
const makeSelectAllUserAuthority = () =>
  createSelector(
    selectMenu,
    menuState => menuState.listUserAuthority,
  );

const makeSelectListAction = () =>
  createSelector(
    selectMenu,
    menuState => menuState.listAction,
  );
const makeSelectError = () =>
  createSelector(
    selectMenu,
    menuState => menuState.error,
  );
const makeSelectApiMessage = () =>
  createSelector(
    selectMenu,
    menuState => menuState.apiMessage,
  );

const makeSelectMenuLoaded = () =>
  createSelector(
    selectMenu,
    menuState => menuState.menuLoaded,
  );

const makeSelectIsMenuExpanded = () =>
  createSelector(
    selectMenu,
    menuState => menuState.expanded,
  );

export {
  makeSelectUserMenu,
  makeSideBarOpen,
  makeSelectError,
  makeSelectUserMenuRawData,
  makeSelectIsDataLoaded,
  // makeSelectUserAuthority,
  makeSelectIsAuthorityLoaded,
  makeSelectListAction,
  makeSelectAllUserAuthority,
  makeSelectMenuLoaded,
  makeSelectApiMessage,
  makeSelectIsMenuExpanded,
};
