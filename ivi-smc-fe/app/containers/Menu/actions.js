import {
  LOAD_MENU,
  LOAD_MENU_ERROR,
  LOAD_MENU_SUCCESS,
  LOAD_USER_ATHORITY,
  LOAD_USER_ATHORITY_ERROR,
  LOAD_USER_ATHORITY_SUCCESS,
  CHANGE_EXPAND_MENU,
  CHANGE_SELECTED_ITEMS,
  CHANGE_EXPANDED_ITEM,
  UNLOAD_MENU,
} from './constants';

export function loadMenu() {
  return {
    type: LOAD_MENU,
  };
}
export function loadMenuSuccess(response) {
  return {
    type: LOAD_MENU_SUCCESS,
    response,
  };
}
export function loadMenuError(error) {
  return {
    type: LOAD_MENU_ERROR,
    error,
  };
}
export function loadUserAuthority() {
  return {
    type: LOAD_USER_ATHORITY,
  };
}
export function loadUserAuthoritySuccess(response) {
  return {
    type: LOAD_USER_ATHORITY_SUCCESS,
    response,
  };
}
export function loadUserAuthorityError(error) {
  return {
    type: LOAD_USER_ATHORITY_ERROR,
    error,
  };
}

// }
export function changeExpandMenu(expanded) {
  return {
    type: CHANGE_EXPAND_MENU,
    expanded,
  };
}
export function changeSelectedItems(item) {
  return {
    type: CHANGE_SELECTED_ITEMS,
    item,
  };
}
export function changeExpandedItems(item) {
  return {
    type: CHANGE_EXPANDED_ITEM,
    item,
  };
}
export function unloadMenu() {
  return {
    type: UNLOAD_MENU,
  };
}
