/*
 *
 * Profile actions
 *
 */

import {
  LOADING,
  LOAD_PROFILE,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_ERROR,
  CHANGE_PASSWORD_PROFILE,
  CHANGE_PASSWORD_PROFILE_SUCCESS,
  CHANGE_PASSWORD_PROFILE_ERROR,
} from './constants';

export function showLoading() {
  return {
    type: LOADING,
  };
}

export function loadProfile() {
  return {
    type: LOAD_PROFILE,
  };
}

export function loadProfileSuccess(data) {
  return {
    type: LOAD_PROFILE_SUCCESS,
    data,
  };
}

export function loadProfileError(err) {
  return {
    type: LOAD_PROFILE_ERROR,
    err,
  };
}

export function changePasswordProfile(request) {
  return {
    type: CHANGE_PASSWORD_PROFILE,
    request,
  };
}

export function changePasswordProfileSuccess(data) {
  return {
    type: CHANGE_PASSWORD_PROFILE_SUCCESS,
    data,
  };
}

export function changePasswordProfileError(err) {
  return {
    type: CHANGE_PASSWORD_PROFILE_ERROR,
    err,
  };
}
