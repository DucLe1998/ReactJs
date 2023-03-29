/*
 *
 * UpdatePassword actions
 *
 */

import {
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_ERROR,
  UPDATE_PASSWORD_SUCCESS,
  LOADING,
  CLEAR_ERROR,
} from './constants';

export function loading(isLoading) {
  return {
    type: LOADING,
    isLoading,
  };
}

export function updatePassword(data) {
  return {
    type: UPDATE_PASSWORD,
    data,
  };
}
export function updatePasswordSuccess() {
  return {
    type: UPDATE_PASSWORD_SUCCESS,
  };
}
export function updatePasswordError(error) {
  return {
    type: UPDATE_PASSWORD_ERROR,
    error,
  };
}
export function clearError() {
  return {
    type: CLEAR_ERROR,
  };
}
