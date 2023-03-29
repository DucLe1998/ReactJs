/*
 *
 * ListCamera actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_LOADING,
  SET_OPEN_DRAWER,
  SET_PAGE,
  LOAD_LIST_CAMERA,
  LOAD_LIST_CAMERA_SUCCESS,
  LOAD_LIST_CAMERA_ERROR,
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
// camera
export function loadListCamera(query) {
  return {
    type: LOAD_LIST_CAMERA,
    query,
  };
}
export function loadListCameraSuccess(data) {
  return {
    type: LOAD_LIST_CAMERA_SUCCESS,
    data,
  };
}
export function loadListCameraError(err) {
  return {
    type: LOAD_LIST_CAMERA_ERROR,
    err,
  };
}
