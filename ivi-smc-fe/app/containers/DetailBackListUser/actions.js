/*
 *
 * DetailBackListUser actions
 *
 */

import {
  CLEAR_STATE,
  DEFAULT_ACTION,
  LOAD_BLOCK,
  LOAD_BLOCK_ERROR,
  LOAD_BLOCK_SUCCESS,
  LOAD_DETAIL_EVENT,
  LOAD_DETAIL_EVENT_ERROR,
  LOAD_DETAIL_EVENT_SUCCESS,
  LOAD_FLOOR,
  LOAD_FLOOR_ERROR,
  LOAD_FLOOR_SUCCESS,
  LOAD_LIST_DEVICE,
  LOAD_LIST_DEVICE_ERROR,
  LOAD_LIST_DEVICE_SUCCESS,
  LOAD_MOVEMENT_HISTORY,
  LOAD_MOVEMENT_HISTORY_ERROR,
  LOAD_MOVEMENT_HISTORY_SUCCESS,
  SET_FORM_TYPE,
  SET_LOADING,
  SET_OPEN_DRAWER,
  UPDATE_DESCRIPTION,
  UPDATE_DESCRIPTION_ERROR,
  UPDATE_DESCRIPTION_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function clearState() {
  return {
    type: CLEAR_STATE,
  };
}

export function setLoading(data) {
  return {
    type: SET_LOADING,
    data,
  };
}

export function setOpenDrawer(data) {
  return {
    type: SET_OPEN_DRAWER,
    data,
  };
}

export function setFormType(data) {
  return {
    type: SET_FORM_TYPE,
    data,
  };
}

export function loadDetailEvent(data) {
  return {
    type: LOAD_DETAIL_EVENT,
    data,
  };
}

export function loadDetailEventSuccess(data) {
  return {
    type: LOAD_DETAIL_EVENT_SUCCESS,
    data,
  };
}

export function loadDetailEventError(error) {
  return {
    type: LOAD_DETAIL_EVENT_ERROR,
    error,
  };
}

export function loadBlock(data) {
  return {
    type: LOAD_BLOCK,
    data,
  };
}

export function loadBlockSuccess(data) {
  return {
    type: LOAD_BLOCK_SUCCESS,
    data,
  };
}

export function loadBlockError(error) {
  return {
    type: LOAD_BLOCK_ERROR,
    error,
  };
}

export function loadFloor(data) {
  return {
    type: LOAD_FLOOR,
    data,
  };
}

export function loadFloorSuccess(data) {
  return {
    type: LOAD_FLOOR_SUCCESS,
    data,
  };
}

export function loadFloorError(error) {
  return {
    type: LOAD_FLOOR_ERROR,
    error,
  };
}

export function loadListDevice(data) {
  return {
    type: LOAD_LIST_DEVICE,
    data,
  };
}

export function loadListDeviceSuccess(data) {
  return {
    type: LOAD_LIST_DEVICE_SUCCESS,
    data,
  };
}

export function loadListDeviceError(error) {
  return {
    type: LOAD_LIST_DEVICE_ERROR,
    error,
  };
}

export function loadMovementHis(data) {
  return {
    type: LOAD_MOVEMENT_HISTORY,
    data,
  };
}

export function loadMovementHisSuccess(data) {
  return {
    type: LOAD_MOVEMENT_HISTORY_SUCCESS,
    data,
  };
}

export function loadMovementHisError(error) {
  return {
    type: LOAD_MOVEMENT_HISTORY_ERROR,
    error,
  };
}

export function updateDescription(data) {
  return {
    type: UPDATE_DESCRIPTION,
    data,
  };
}

export function updateDescriptionSuccess(data) {
  return {
    type: UPDATE_DESCRIPTION_SUCCESS,
    data,
  };
}

export function updateDescriptionError(error) {
  return {
    type: UPDATE_DESCRIPTION_ERROR,
    error,
  };
}
