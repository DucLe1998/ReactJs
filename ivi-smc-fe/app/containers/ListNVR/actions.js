import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_NVR_DETAIL,
  LOAD_NVR_DETAIL_SUCCESS,
  LOAD_NVR_DETAIL_ERROR,
  LOAD_NVR_CAMERAS,
  LOAD_NVR_CAMERAS_ERROR,
  LOAD_NVR_CAMERAS_SUCCESS,
  DELETE_ROWS,
  DELETE_ROWS_SUCCESS,
  ADD_NEW_SUCCESS,
  ADD_NEW,
  UPDATE_ROW,
  UPDATE_ROW_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  DOWNLOAD_TEMPLATE,
  DOWNLOAD_TEMPLATE_SUCCESS,
  IMPORT_FILE,
  IMPORT_FILE_SUCCESS,
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
export function loadDetail(id) {
  return {
    type: LOAD_NVR_DETAIL,
    id,
  };
}
export function loadDetailSuccess(data) {
  return {
    type: LOAD_NVR_DETAIL_SUCCESS,
    data,
  };
}
export function loadDetailError(err) {
  return {
    type: LOAD_NVR_DETAIL_ERROR,
    err,
  };
}
export function loadNVRCameras(id) {
  return {
    type: LOAD_NVR_CAMERAS,
    id,
  };
}
export function loadNVRCamerasSuccess(data) {
  return {
    type: LOAD_NVR_CAMERAS_SUCCESS,
    data,
  };
}
export function loadNVRCamerasError(err) {
  return {
    type: LOAD_NVR_CAMERAS_ERROR,
    err,
  };
}
export function showLoading(isLoading) {
  return {
    type: SHOW_LOADING,
    isLoading,
  };
}
export function deleteRows(rows) {
  return {
    type: DELETE_ROWS,
    rows,
  };
}
export function deleteRowsSuccess(data) {
  return {
    type: DELETE_ROWS_SUCCESS,
    data,
  };
}
export function addNewRow(data, close) {
  return {
    type: ADD_NEW,
    data,
    close,
  };
}
export function addNewRowSuccess(data) {
  return {
    type: ADD_NEW_SUCCESS,
    data,
  };
}
export function updateRow(id, data) {
  return {
    type: UPDATE_ROW,
    id,
    data,
  };
}
export function updateRowSuccess(data) {
  return {
    type: UPDATE_ROW_SUCCESS,
    data,
  };
}
export function changePassword(id, data) {
  return {
    type: CHANGE_PASSWORD,
    id,
    data,
  };
}
export function changePasswordSuccess(data) {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    data,
  };
}
export function downloadTemplate() {
  return {
    type: DOWNLOAD_TEMPLATE,
  };
}
export function downloadTemplateSuccess(data) {
  return {
    type: DOWNLOAD_TEMPLATE_SUCCESS,
    data,
  };
}
export function importFile(file) {
  return {
    type: IMPORT_FILE,
    file,
  };
}
export function importFileSuccess(data) {
  return {
    type: IMPORT_FILE_SUCCESS,
    data,
  };
}
