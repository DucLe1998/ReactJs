/*
 *
 * ListWarning actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_LOADING,
  SET_OPEN_DRAWER,
  SET_PAGE,
  LOAD_LIST_WARNING,
  LOAD_LIST_WARNING_SUCCESS,
  LOAD_LIST_WARNING_ERROR,
  EDIT_WARNING,
  EDIT_WARNING_SUCCESS,
  EDIT_WARNING_ERROR,
  INFO_WARNING,
  INFO_WARNING_SUCCESS,
  INFO_WARNING_ERROR,
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
// warning
export function loadListWarning(query) {
  return {
    type: LOAD_LIST_WARNING,
    query,
  };
}
export function loadListWarningSuccess(data) {
  return {
    type: LOAD_LIST_WARNING_SUCCESS,
    data,
  };
}
export function loadListWarningError(err) {
  return {
    type: LOAD_LIST_WARNING_ERROR,
    err,
  };
}
// warning info
export function loadInfoWarningAction(data) {
  return {
    type: INFO_WARNING,
    data,
  };
}
export function loadInfoWarningSuccess(data) {
  return {
    type: INFO_WARNING_SUCCESS,
    data,
  };
}
export function loadInfoWarningError(err) {
  return {
    type: INFO_WARNING_ERROR,
    err,
  };
}
// edit warning
export function editWarningAction(data) {
  return {
    type: EDIT_WARNING,
    data,
  };
}
export function editWarningSuccess(data) {
  return {
    type: EDIT_WARNING_SUCCESS,
    data,
  };
}
export function editWarningError(err) {
  return {
    type: EDIT_WARNING_ERROR,
    err,
  };
}
