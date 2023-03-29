import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_DATA_DETAIL,
  LOAD_DATA_DETAIL_SUCCESS,
  LOAD_DATA_DETAIL_ERROR,
  UPDATE,
  UPDATE_SUCCESS,
  CHANGE_FIELD,
  DELETE,
  DELETE_SUCCESS,
  ADD,
  ADD_SUCCESS,
} from './constants';

export function addDevice(filterObj) {
  return {
    type: ADD,
    filterObj,
  };
}

export function addDeviceSuccess(data) {
  return {
    type: ADD_SUCCESS,
    data,
  };
}

export function deleteArticle(data) {
  return {
    type: DELETE,
    data,
  };
}

export function deleteSuccess(data) {
  return {
    type: DELETE_SUCCESS,
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

export function updateItem(data, dataSub) {
  return {
    type: UPDATE,
    data,
    dataSub,
  };
}

export function updateDeviceSuccess(data) {
  return {
    type: UPDATE_SUCCESS,
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

export function loadDataDetail(filterObj) {
  return {
    type: LOAD_DATA_DETAIL,
    filterObj,
  };
}

export function loadDataDetailSuccess(data) {
  return {
    type: LOAD_DATA_DETAIL_SUCCESS,
    data,
  };
}

export function loadDataDetailError(err) {
  return {
    type: LOAD_DATA_DETAIL_ERROR,
    err,
  };
}
