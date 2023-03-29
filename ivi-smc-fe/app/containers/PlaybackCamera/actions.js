import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  ADD_CAMERA_TO_PLAYBACK_SUCCESS,
  ADD_CAMERA_TO_PLAYBACK,
  CHANGE_FIELD,
  LOAD_DATA_PLAYBACK,
  LOAD_DATA_PLAYBACK_SUCCESS,
} from './constants';

export function loadDataPlayback(filterObj) {
  return {
    type: LOAD_DATA_PLAYBACK,
    filterObj,
  };
}

export function loadDataPlaybackSuccess(data) {
  return {
    type: LOAD_DATA_PLAYBACK_SUCCESS,
    data,
  };
}

export function changeField(field, value) {
  return {
    type: CHANGE_FIELD,
    field,
    value,
  };
}

export function addCamToView(filterObj) {
  return {
    type: ADD_CAMERA_TO_PLAYBACK,
    filterObj,
  };
}

export function addCamToViewSuccess(data) {
  return {
    type: ADD_CAMERA_TO_PLAYBACK_SUCCESS,
    data,
  };
}

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

export function showLoading(isLoading) {
  return {
    type: SHOW_LOADING,
    isLoading,
  };
}
