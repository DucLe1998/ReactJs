/*
 *
 * Library actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_LOADING,
  SET_PAGE,
  LOAD_LIST_FILE,
  LOAD_LIST_FILE_SUCCESS,
  LOAD_LIST_FILE_ERROR,
  DELETE_FILE,
  DELETE_FILE_SUCCESS,
  DELETE_FILE_ERROR,
  DOWNLOAD_FILE,
  DOWNLOAD_FILE_SUCCESS,
  DOWNLOAD_FILE_ERROR,
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
// load file
export function loadListFile(query) {
  return {
    type: LOAD_LIST_FILE,
    query,
  };
}
export function loadListFileSuccess(data) {
  return {
    type: LOAD_LIST_FILE_SUCCESS,
    data,
  };
}
export function loadListFileError(err) {
  return {
    type: LOAD_LIST_FILE_ERROR,
    err,
  };
}
// delete file
export function deleteFileAction(data) {
  return {
    type: DELETE_FILE,
    data,
  };
}
export function deleteFileSuccess(data) {
  return {
    type: DELETE_FILE_SUCCESS,
    data,
  };
}
export function deleteFileError(err) {
  return {
    type: DELETE_FILE_ERROR,
    err,
  };
}
// download file
export function downloadFileAction(data) {
  return {
    type: DOWNLOAD_FILE,
    data,
  };
}
export function downloadFileSuccess(data) {
  return {
    type: DOWNLOAD_FILE_SUCCESS,
    data,
  };
}
export function downloadFileError(err) {
  return {
    type: DOWNLOAD_FILE_ERROR,
    err,
  };
}
