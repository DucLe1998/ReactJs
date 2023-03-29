/*
 *
 * HumanDashboard actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_LOADING,
  SET_OPEN_DRAWER,
  SET_PAGE,
  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function setLoading(status) {
  return {
    type: SET_LOADING,
    status,
  };
}
export function setPageAction(page) {
  return {
    type: SET_PAGE,
    page,
  };
}
export function setOpenDrawerAction(status) {
  return {
    type: SET_OPEN_DRAWER,
    status,
  };
}
// get list
export function loadList(query) {
  return {
    type: LOAD_LIST,
    query,
  };
}
export function loadListSuccess(data) {
  return {
    type: LOAD_LIST_SUCCESS,
    data,
  };
}
export function loadListError(err) {
  return {
    type: LOAD_LIST_ERROR,
    err,
  };
}
