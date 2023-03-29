import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_LIST_PARENT_MENU,
  LOAD_LIST_PARENT_MENU_SUCCESS,
  LOAD_LIST_PARENT_MENU_ERROR,
  CLEAR_ERROR,
} from './constants';

export function loadData(filterObj) {
  return {
    type: LOAD_DATA,
    filterObj,
  };
}
export function loadDataSuccess(data) {
  return {
    type: LOAD_DATA_SUCCESS,
    data,
  };
}
export function loadDataError(err) {
  return {
    type: LOAD_DATA_ERROR,
    err,
  };
}

export function loadParentMenu(query) {
  return {
    type: LOAD_LIST_PARENT_MENU,
    query,
  };
}
export function loadParentMenuSuccess(data) {
  return {
    type: LOAD_LIST_PARENT_MENU_SUCCESS,
    data,
  };
}
export function loadParentMenuError(err) {
  return {
    type: LOAD_LIST_PARENT_MENU_ERROR,
    err,
  };
}

export function showLoading(isLoading) {
  return {
    type: SHOW_LOADING,
    isLoading,
  };
}
export function clearError() {
  return {
    type: CLEAR_ERROR,
  };
}
