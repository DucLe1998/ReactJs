import {
  LOADING,
  LOAD_LIST_ITEMS_TYPE,
  LOAD_LIST_ITEMS_TYPE_SUCCESS,
  LOAD_LIST_ITEMS_TYPE_ERROR,
  LOAD_LIST_ITEMS_COLOR,
  LOAD_LIST_ITEMS_COLOR_SUCCESS,
  LOAD_LIST_ITEMS_COLOR_ERROR,
  LOAD_LIST_ITEMS_CAMERAAI,
  LOAD_LIST_ITEMS_CAMERAAI_SUCCESS,
  LOAD_LIST_ITEMS_CAMERAAI_ERROR,
} from './constants';

export function showLoading() {
  return {
    type: LOADING,
  };
}

export function loadListItemType() {
  return {
    type: LOAD_LIST_ITEMS_TYPE,
  };
}

export function loadListItemTypeSuccess(data) {
  return {
    type: LOAD_LIST_ITEMS_TYPE_SUCCESS,
    data,
  };
}

export function loadListItemTypeError(error) {
  return {
    type: LOAD_LIST_ITEMS_TYPE_ERROR,
    error,
  };
}

export function loadListItemColor() {
  return {
    type: LOAD_LIST_ITEMS_COLOR,
  };
}

export function loadListItemColorSuccess(data) {
  return {
    type: LOAD_LIST_ITEMS_COLOR_SUCCESS,
    data,
  };
}

export function loadListItemColorError(error) {
  return {
    type: LOAD_LIST_ITEMS_COLOR_ERROR,
    error,
  };
}

export function loadListItemCameraai(filterObj) {
  return {
    type: LOAD_LIST_ITEMS_CAMERAAI,
    filterObj,
  };
}

export function loadListItemCameraaiSuccess(data) {
  return {
    type: LOAD_LIST_ITEMS_CAMERAAI_SUCCESS,
    data,
  };
}

export function loadListItemCameraaiError(error) {
  return {
    type: LOAD_LIST_ITEMS_CAMERAAI_ERROR,
    error,
  };
}
