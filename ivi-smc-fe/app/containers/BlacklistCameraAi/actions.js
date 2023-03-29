/*
 *
 * BlacklistCameraAi actions
 *
 */

import {
  ADD_BLACKLIST,
  ADD_BLACKLIST_ERROR,
  ADD_BLACKLIST_SUCCESS,
  DEFAULT_ACTION,
  DELETE_USER,
  DELETE_USER_ERROR,
  DELETE_USER_SUCCESS,
  DOWNLOAD_BLACKLIST,
  DOWNLOAD_BLACKLIST_ERROR,
  DOWNLOAD_BLACKLIST_SUCCESS,
  LOAD_BLACKLIST,
  LOAD_BLACKLIST_ERROR,
  LOAD_BLACKLIST_SUCCESS,
  LOAD_MOVEMENT_DETECTED_HISTORY,
  LOAD_MOVEMENT_DETECTED_HISTORY_ERROR,
  LOAD_MOVEMENT_DETECTED_HISTORY_SUCCESS,
  LOAD_RELATED_IMAGE,
  LOAD_RELATED_IMAGE_ERROR,
  LOAD_RELATED_IMAGE_SUCCESS,
  SET_FORM,
  SET_LOADING,
  SET_OPEN_MOVEMENT_DETECTED_HISTORY_POPUP,
  UPDATE_NAME,
  UPDATE_NAME_ERROR,
  UPDATE_NAME_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function setLoading() {
  return {
    type: SET_LOADING,
  };
}

export function loadBlackList(filterObj) {
  return {
    type: LOAD_BLACKLIST,
    filterObj,
  };
}

export function loadBlackListSuccess(data) {
  return {
    type: LOAD_BLACKLIST_SUCCESS,
    data,
  };
}

export function loadBlackListError(error) {
  return {
    type: LOAD_BLACKLIST_ERROR,
    error,
  };
}

export function updateName(data) {
  return {
    type: UPDATE_NAME,
    data,
  };
}

export function updateNameSuccess() {
  return {
    type: UPDATE_NAME_SUCCESS,
  };
}

export function updateNameError(error) {
  return {
    type: UPDATE_NAME_ERROR,
    error,
  };
}

export function deleteUser(data) {
  return {
    type: DELETE_USER,
    data,
  };
}

export function deleteUserSuccess() {
  return {
    type: DELETE_USER_SUCCESS,
  };
}

export function deleteUserError(error) {
  return {
    type: DELETE_USER_ERROR,
    error,
  };
}

export function setOpenMovementDetectedHistoryPopup(status) {
  return {
    type: SET_OPEN_MOVEMENT_DETECTED_HISTORY_POPUP,
    status,
  };
}

export function loadMovementDetectedHistory(filterObj) {
  return {
    type: LOAD_MOVEMENT_DETECTED_HISTORY,
    filterObj,
  };
}

export function loadMovementDetectedHistorySuccess(data) {
  return {
    type: LOAD_MOVEMENT_DETECTED_HISTORY_SUCCESS,
    data,
  };
}

export function loadMovementDetectedHistoryError(error) {
  return {
    type: LOAD_MOVEMENT_DETECTED_HISTORY_ERROR,
    error,
  };
}

export function loadRelatedImage(file) {
  return {
    type: LOAD_RELATED_IMAGE,
    file,
  };
}

export function loadRelatedImageSuccess(data) {
  return {
    type: LOAD_RELATED_IMAGE_SUCCESS,
    data,
  };
}

export function loadRelatedImageError(error) {
  return {
    type: LOAD_RELATED_IMAGE_ERROR,
    error,
  };
}

export function addBlackList(data) {
  return {
    type: ADD_BLACKLIST,
    data,
  };
}

export function addBlackListSuccess(data) {
  return {
    type: ADD_BLACKLIST_SUCCESS,
    data,
  };
}

export function addBlackListError(error) {
  return {
    type: ADD_BLACKLIST_ERROR,
    error,
  };
}

export function setForm(form) {
  return {
    type: SET_FORM,
    form,
  };
}

export function downloadBlackList(data) {
  return {
    type: DOWNLOAD_BLACKLIST,
    data,
  };
}

export function downloadBlackListSuccess(data) {
  return {
    type: DOWNLOAD_BLACKLIST_SUCCESS,
    data,
  };
}

export function downloadBlackListError(error) {
  return {
    type: DOWNLOAD_BLACKLIST_ERROR,
    error,
  };
}
