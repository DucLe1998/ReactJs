import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
} from './constants';

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
