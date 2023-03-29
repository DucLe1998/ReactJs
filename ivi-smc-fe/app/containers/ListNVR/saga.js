import { call, put, takeLatest } from 'redux-saga/effects';
import { showSuccess, showError } from 'utils/toast-utils';
import {
  ADD_NEW,
  CHANGE_PASSWORD,
  DELETE_ROWS,
  DOWNLOAD_TEMPLATE,
  IMPORT_FILE,
  LOAD_DATA,
  LOAD_NVR_CAMERAS,
  LOAD_NVR_DETAIL,
  UPDATE_ROW,
} from './constants';
import { API_ROUTE } from '../apiUrl';
import {
  loadDataSuccess,
  loadDataError,
  loadDetailSuccess,
  loadDetailError,
  loadNVRCamerasSuccess,
  loadNVRCamerasError,
  deleteRowsSuccess,
  addNewRowSuccess,
  updateRowSuccess,
  changePasswordSuccess,
  downloadTemplateSuccess,
  importFileSuccess,
  showLoading,
} from './actions';
import { callApi, callApiWithConfig, METHODS } from '../../utils/requestUtils';
import { getErrorMessage } from '../Common/function';
let listNVROldQuery = '';
export function* getListData(action) {
  try {
    listNVROldQuery = action.filterObj;
    const response = yield call(
      callApi,
      API_ROUTE.LIST_NVR +
        (action.filterObj ? action.filterObj : listNVROldQuery),
      METHODS.GET,
    );
    yield put(loadDataSuccess(response));
  } catch (err) {
    yield put(loadDataError(err));
  }
}

export function* getNVRDetail(action) {
  try {
    yield put(showLoading(true));
    const response = yield call(
      callApi,
      `${API_ROUTE.LIST_NVR}/${action.id}`,
      METHODS.GET,
    );
    yield put(showLoading(false));
    yield put(loadDetailSuccess(response));
  } catch (err) {
    yield put(loadDetailError(err));
  }
}

export function* getNVRCameras(action) {
  try {
    const response = yield call(
      callApi,
      `${API_ROUTE.LIST_NVR}/${action.id}/child-devices`,
      METHODS.GET,
    );
    yield put(loadNVRCamerasSuccess(response));
  } catch (err) {
    yield put(loadNVRCamerasError(err));
  }
}
export function* deleteRows(action) {
  try {
    const response = yield call(
      callApi,
      `${API_ROUTE.LIST_NVR}?device-id-list=${action.rows.join(',')}`,
      METHODS.DELETE,
    );
    showSuccess('Xóa thành công');
    yield put(deleteRowsSuccess(response));
  } catch (err) {
    // showSuccess('AAAAAAAAAAAAAa');
  }
}
export function* addNewRow(action) {
  try {
    const response = yield call(
      callApi,
      API_ROUTE.LIST_NVR,
      METHODS.POST,
      action.data,
    );
    showSuccess('Thêm mới thành công');
    action.close();
    yield put(addNewRowSuccess(response));
  } catch (err) {
    yield put(showLoading(false));
    showError(getErrorMessage(err));
  }
}
export function* updateRow(action) {
  try {
    yield put(showLoading(true));
    const response = yield call(
      callApi,
      `${API_ROUTE.LIST_NVR}/${action.id}`,
      METHODS.PUT,
      action.data,
    );
    showSuccess('Cập nhật thành công');
    yield put(updateRowSuccess(response));
  } catch (err) {
    yield put(showLoading(false));
    showError(getErrorMessage(err));
    // showSuccess('AAAAAAAAAAAAAa');
  }
}
export function* changePassword(action) {
  try {
    yield put(showLoading(true));
    const response = yield call(
      callApi,
      `${API_ROUTE.LIST_NVR}/change-password/${action.id}`,
      METHODS.PUT,
      action.data,
    );
    showSuccess('Thay đổi mật khẩu thành công');
    yield put(changePasswordSuccess(response));
  } catch (err) {
    yield put(showLoading(false));
    showError(getErrorMessage(err));
    // showSuccess('AAAAAAAAAAAAAa');
  }
}
export function* importFile(action) {
  const formData = new FormData();
  const axiosConfig = {
    // responseType: 'blob',
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    responseType: 'blob',
  };
  formData.append('file', action.file);
  try {
    yield put(showLoading(true));
    const response = yield call(
      callApiWithConfig,
      `${API_ROUTE.LIST_NVR}/import`,
      METHODS.POST,
      formData,
      axiosConfig,
    );
    showSuccess('Vui lòng kiểm tra chi tiết kết quả trong file');
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kết quả.xlsx`);
    link.click();
    yield put(importFileSuccess());
  } catch (err) {
    yield put(showLoading(false));
    if (err?.response?.status == 400) {
      showError('Dữ liệu trong file không hợp lệ.');
      const url = window.URL.createObjectURL(new Blob([err.response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kết quả lỗi.xlsx`);
      link.click();
    }else{
      showError(err);
    }
  }
}
export function* downloadTemplateXls() {
  const axiosConfig = {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    responseType: 'blob',
  };
  try {
    const response = yield call(
      callApiWithConfig,
      API_ROUTE.NVR_IMPORT_TEMPLATE,
      METHODS.GET,
      {},
      axiosConfig,
    );
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `template.xlsx`);
    link.click();
    // var blob = new Blob([response], { type: "data:text/plain;charset=utf-8" });
    // FileSaver.saveAs(blob, "template.xlsx");
    yield put(downloadTemplateSuccess());
  } catch (err) {
    //----
    yield put(showLoading(false));
    console.log(err);
    showError(err.message);
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_DATA, getListData);
  yield takeLatest(LOAD_NVR_DETAIL, getNVRDetail);
  yield takeLatest(LOAD_NVR_CAMERAS, getNVRCameras);
  yield takeLatest(DELETE_ROWS, deleteRows);
  yield takeLatest(ADD_NEW, addNewRow);
  yield takeLatest(UPDATE_ROW, updateRow);
  yield takeLatest(CHANGE_PASSWORD, changePassword);
  yield takeLatest(DOWNLOAD_TEMPLATE, downloadTemplateXls);
  yield takeLatest(IMPORT_FILE, importFile);
}
