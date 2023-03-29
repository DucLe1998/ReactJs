/*
 *
 * Policy actions
 *
 */

import {
  ADD_NEW,
  ADD_NEW_SUCCESS,
  DELETE_POLICY,
  DELETE_POLICY_SUCCESS,
  GET_POLICY_ACTION,
  GET_POLICY_RESOURCE_ACTION,
  LOAD_POLICY_FAIL,
  LOAD_POLICY_SUCCESS,
  LOAD_POLICY_RESOURCE_FAIL,
  LOAD_POLICY_RESOURCE_SUCCESS,
  SHOW_LOADING,
  LOAD_DETAIL,
  LOAD_DETAIL_SUCCESS,
  LOAD_DETAIL_FAIL,
  EDIT_POLICY,
  EDIT_POLICY_SUCCESS,
  LOAD_MENU_ID,
  LOAD_MENU_ID_SUCCESS,
  LOAD_ERROR,
} from './constants';

export function getPolicyAction(payload) {
  return {
    type: GET_POLICY_ACTION,
    payload,
  };
}

export function loadPolicySuccess(data) {
  return {
    type: LOAD_POLICY_SUCCESS,
    data,
  };
}

export function loadPolicyFail(payload) {
  return {
    type: LOAD_POLICY_FAIL,
    payload,
  };
}

export function getPolicyResourceAction() {
  return {
    type: GET_POLICY_RESOURCE_ACTION,
  };
}

export function loadResourceSuccess(data) {
  return {
    type: LOAD_POLICY_RESOURCE_SUCCESS,
    data,
  };
}

export function loadResourceFail(payload) {
  return {
    type: LOAD_POLICY_RESOURCE_FAIL,
    payload,
  };
}
export function deletePolicy(rows) {
  return {
    type: DELETE_POLICY,
    rows,
  };
}

export function deletePolicySuccess(data) {
  return {
    type: DELETE_POLICY_SUCCESS,
    data,
  };
}
export function detailPolicy(id) {
  return {
    type: LOAD_DETAIL,
    id,
  };
}
export function detailPolicySuccess(data) {
  return {
    type: LOAD_DETAIL_SUCCESS,
    data,
  };
}
export function getMenuID(id) {
  return {
    type: LOAD_MENU_ID,
    id,
  };
}
export function getMenuIDSuccess(data) {
  return {
    type: LOAD_MENU_ID_SUCCESS,
    data,
  };
}
export function detailPolicyFail(rows) {
  return {
    type: LOAD_DETAIL_FAIL,
    rows,
  };
}
export function addNewRow(data, menu, user) {
  return {
    type: ADD_NEW,
    data,
    menu,
    user,
  };
}
export function addNewRowSuccess(data) {
  return {
    type: ADD_NEW_SUCCESS,
    data,
  };
}
export function editRow(id, data, listMenuId, listUserId) {
  return {
    type: EDIT_POLICY,
    id,
    data,
    listMenuId,
    listUserId,
  };
}
export function editRowSuccess(data) {
  return {
    type: EDIT_POLICY_SUCCESS,
    data,
  };
}
export function showLoading(isLoading) {
  return {
    type: SHOW_LOADING,
    isLoading,
  };
}
export function loadError(key) {
  return {
    type: LOAD_ERROR,
    key,
  };
}
