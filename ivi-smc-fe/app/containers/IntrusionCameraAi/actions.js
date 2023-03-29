import {
  LOADING,
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  UPDATE_DATA,
  SET_FORM_TYPE,
  LOAD_BROADCAST,
  LOAD_BROADCAST_ERROR,
  LOAD_BROADCAST_SUCCESS,
} from './constants';

export function showLoading(data) {
  return {
    type: LOADING,
    data,
  };
}

export function loadData(filterObj) {
  return {
    type: LOAD_DATA,
    filterObj,
  };
}

export function setFormType(data) {
  return {
    type: SET_FORM_TYPE,
    data,
  };
}

export function loadDataSuccess(data) {
  return {
    type: LOAD_DATA_SUCCESS,
    data,
  };
}

export function loadDataError(error) {
  return {
    type: LOAD_DATA_ERROR,
    error,
  };
}

export function UpdateData(id, data) {
  return {
    type: UPDATE_DATA,
    id,
    data,
  };
}

export function loadBroadCast(filterObj) {
  return {
    type: LOAD_BROADCAST,
    filterObj,
  };
}

export function loadBroadCastSuccess(data) {
  return {
    type: LOAD_BROADCAST_SUCCESS,

    data,
  };
}

export function loadBroadCastError(error) {
  return {
    type: LOAD_BROADCAST_ERROR,
    error,
  };
}
