import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  CLEAR_ERROR,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ,
  MARK_AS_READ_ERROR,
} from './constants';

export function loadData(filterQuery) {
  return {
    type: LOAD_DATA,
    filterQuery,
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
export function clearError(err) {
  return {
    type: CLEAR_ERROR,
    err,
  };
}

export function markAsRead(data) {
  return {
    type: MARK_AS_READ,
    data,
  };
}
export function markAsReadSuccess(data) {
  return {
    type: MARK_AS_READ_SUCCESS,
    data,
  };
}
export function markAsReadError(err) {
  return {
    type: MARK_AS_READ_ERROR,
    err,
  };
}
