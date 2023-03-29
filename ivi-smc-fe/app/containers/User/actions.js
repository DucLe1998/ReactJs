import {
  SHOW_LOADING,
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  LOAD_UNIT,
  LOAD_POSITION,
  LOAD_AUTHORITY,
  LOAD_ERROR,
  LOAD_UNIT_SUCCESS,
  LOAD_POSITION_SUCCESS,
  LOAD_AUTHORITY_SUCCESS,
  LOAD_USER,
  LOAD_USER_SUCCESS,
  ADD_USER,
  ADD_USER_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  UPDATE_STATUS_USER,
  UPDATE_STATUS_USER_SUCCESS,
  LOAD_DON_VI_KIEM_NHIEM,
  LOAD_DON_VI_KIEM_NHIEM_SUCCESS,
  UPDATE_DVKN_SUCCESS,
  UPDATE_DVKN,
  DELETE_DVKN,
  DELETE_DVKN_SUCCESS,
  ADD_DVKN_SUCCESS,
  ADD_DVKN, DELETE_ROLE_SUCCESS, DELETE_ROLE,
} from './constants';

export function showLoading(isLoading) {
  return {
    type: SHOW_LOADING,
    isLoading,
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

export function loadUnit() {
  return {
    type: LOAD_UNIT,
  };
}
export function loadUnitSuccess(data) {
  return {
    type: LOAD_UNIT_SUCCESS,
    data,
  };
}
export function loadPosition() {
  return {
    type: LOAD_POSITION,
  };
}
export function loadPositionSuccess(data) {
  return {
    type: LOAD_POSITION_SUCCESS,
    data,
  };
}
export function loadAuthority() {
  return {
    type: LOAD_AUTHORITY,
  };
}
export function loadAuthoritySuccess(data) {
  return {
    type: LOAD_AUTHORITY_SUCCESS,
    data,
  };
}

export function loadUser(userId) {
  return {
    type: LOAD_USER,
    userId,
  };
}
export function loadUserSuccess(data) {
  return {
    type: LOAD_USER_SUCCESS,
    data,
  };
}

export function loadError(key) {
  return {
    type: LOAD_ERROR,
    key,
  };
}

export function addUser(data) {
  return {
    type: ADD_USER,
    data,
  };
}

export function addUserSuccess(data) {
  return {
    type: ADD_USER_SUCCESS,
    data,
  };
}

export function updateUser(data) {
  return {
    type: UPDATE_USER,
    data,
  };
}

export function updateUserSuccess() {
  return {
    type: UPDATE_USER_SUCCESS,
  };
}

export function deleteUser(data) {
  return {
    type: DELETE_USER,
    data,
  };
}

export function deleteUserSuccess(data) {
  return {
    type: DELETE_USER_SUCCESS,
    data,
  };
}

export function updateStatusUser(data) {
  return {
    type: UPDATE_STATUS_USER,
    data,
  };
}

export function updateStatusUserSuccess() {
  return {
    type: UPDATE_STATUS_USER_SUCCESS,
  };
}

export function loadDVKN(data) {
  return {
    type: LOAD_DON_VI_KIEM_NHIEM,
    data,
  };
}

export function loadDVKNSuccess(data) {
  return {
    type: LOAD_DON_VI_KIEM_NHIEM_SUCCESS,
    data,
  };
}

export function addDVKN(data) {
  return {
    type: ADD_DVKN,
    data,
  };
}

export function addDVKNSuccess() {
  return {
    type: ADD_DVKN_SUCCESS,
  };
}

export function updateDVKN(data) {
  return {
    type: UPDATE_DVKN,
    data,
  };
}

export function updateDVKNSuccess() {
  return {
    type: UPDATE_DVKN_SUCCESS,
  };
}

export function deleteDVKN(data) {
  return {
    type: DELETE_DVKN,
    data,
  };
}

export function deleteDVKNSuccess() {
  return {
    type: DELETE_DVKN_SUCCESS,
  };
}

export function deleteRole(id) {
  return {
    type: DELETE_ROLE,
    id,
  };
}

export function deleteRoleSuccess() {
  return {
    type: DELETE_ROLE_SUCCESS,
  };
}
