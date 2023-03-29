/*
 *
 * ListUserCameraAi actions
 *
 */

import {
  LOADING,
  LOAD_SEARCH_HISTORY,
  LOAD_SEARCH_HISTORY_SUCCESS,
  LOAD_SEARCH_HISTORY_ERROR,
  LOAD_AUTOCOMPLETE_SEARCH,
  LOAD_AUTOCOMPLETE_SEARCH_SUCCESS,
  LOAD_AUTOCOMPLETE_SEARCH_ERROR,
  LOAD_USER_DETECTED_EVENT,
  LOAD_USER_DETECTED_EVENT_SUCCESS,
  LOAD_USER_DETECTED_EVENT_ERROR,
  LOAD_USER_DETECTED_IMAGE,
  LOAD_USER_DETECTED_IMAGE_SUCCESS,
  LOAD_USER_DETECTED_IMAGE_ERROR,
  LOAD_FILE_IMAGE,
  CLEAR_FILE_IMAGE_SEARCH,
} from './constants';

export function showLoading() {
  return {
    type: LOADING,
  };
}

export function loadSearchHistory(filterObj) {
  return {
    type: LOAD_SEARCH_HISTORY,
    filterObj,
  };
}

export function loadSearchHistorySuccess(data) {
  return {
    type: LOAD_SEARCH_HISTORY_SUCCESS,
    data,
  };
}

export function loadSearchHistoryError(error) {
  return {
    type: LOAD_SEARCH_HISTORY_ERROR,
    error,
  };
}

export function loadAutoCompleteSearch(filterObj) {
  return {
    type: LOAD_AUTOCOMPLETE_SEARCH,
    filterObj,
  };
}

export function loadAutoCompleteSearchSuccess(data) {
  return {
    type: LOAD_AUTOCOMPLETE_SEARCH_SUCCESS,
    data,
  };
}

export function loadAutoCompleteSearchError(error) {
  return {
    type: LOAD_AUTOCOMPLETE_SEARCH_ERROR,
    error,
  };
}

export function loadUserDetectedEvent(filterObj) {
  return {
    type: LOAD_USER_DETECTED_EVENT,
    filterObj,
  };
}

export function loadUserDetectedEventSuccess(data) {
  return {
    type: LOAD_USER_DETECTED_EVENT_SUCCESS,
    data,
  };
}

export function loadUserDetectedEventError(error) {
  return {
    type: LOAD_USER_DETECTED_EVENT_ERROR,
    error,
  };
}

export function loadFileImage(file) {
  return {
    type: LOAD_FILE_IMAGE,
    file,
  };
}

export function loadFileImageSearch(file) {
  return {
    type: CLEAR_FILE_IMAGE_SEARCH,
    file,
  };
}

export function loadUserDetectedImage(data) {
  return {
    type: LOAD_USER_DETECTED_IMAGE,
    data,
  };
}

export function loadUserDetectedImageSuccess(data) {
  return {
    type: LOAD_USER_DETECTED_IMAGE_SUCCESS,
    data,
  };
}

export function loadUserDetectedImageError(error) {
  return {
    type: LOAD_USER_DETECTED_IMAGE_ERROR,
    error,
  };
}
