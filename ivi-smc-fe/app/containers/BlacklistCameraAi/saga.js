import { put, takeLatest, call } from 'redux-saga/effects';
// import faker from 'faker';
// import { get } from 'lodash';
import {
  addBlackListError,
  addBlackListSuccess,
  deleteUserError,
  deleteUserSuccess,
  downloadBlackListError,
  downloadBlackListSuccess,
  loadBlackListError,
  loadBlackListSuccess,
  loadMovementDetectedHistoryError,
  loadMovementDetectedHistorySuccess,
  loadRelatedImageError,
  loadRelatedImageSuccess,
  setLoading,
  updateNameError,
  updateNameSuccess,
} from './actions';
import {
  ADD_BLACKLIST,
  DELETE_USER,
  DOWNLOAD_BLACKLIST,
  LOAD_BLACKLIST,
  LOAD_MOVEMENT_DETECTED_HISTORY,
  LOAD_RELATED_IMAGE,
  UPDATE_NAME,
} from './constants';
import {
  callApi,
  callApiWithConfig,
  getApi,
  METHODS,
  putApi,
} from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';

export function* loadBlackList(action) {
  yield put(setLoading(true));
  try {
    const response = yield call(
      getApi,
      API_CAMERA_AI.LIST_BLACKLIST_USER_3_6,
      action.filterObj,
    );
    const { data } = response;
    yield put(loadBlackListSuccess(data));
  } catch (err) {
    yield put(loadBlackListError(err));
  }
}

export function* deleteUser(action) {
  yield put(setLoading(true));
  try {
    yield call(
      callApi,
      `${API_CAMERA_AI.DELETE_LIST_USER_3_6}?ids=${action.data.join(',')}`,
      METHODS.DELETE,
    );
    yield put(deleteUserSuccess());
  } catch (err) {
    yield put(deleteUserError(err));
  }
}

export function* loadMovementDetectedHistory(action) {
  yield put(setLoading(true));
  try {
    const response = yield call(
      callApi,
      `${API_CAMERA_AI.MOVEMENT_DETECTED_HISTORY_3_6}/${action.filterObj.uuid}`,
      METHODS.GET,
    );
    response.selectedUser = action.filterObj;
    yield put(loadMovementDetectedHistorySuccess(response));
  } catch (err) {
    yield put(loadMovementDetectedHistoryError(err));
  }
}

export function* updateUser(action) {
  yield put(setLoading(true));
  try {
    yield call(putApi, API_CAMERA_AI.UPDATE_USER_3_6(action.data.id), {
      name: action.data.name,
    });
    yield put(updateNameSuccess());
  } catch (err) {
    yield put(updateNameError(err));
  }
}

export function* getListUserDetectedImage(action) {
  const formData = new FormData();
  formData.append('image', action.file);
  yield put(setLoading());
  try {
    const responseImage = yield call(
      callApi,
      `${API_CAMERA_AI.SEARCH_USER_DETECTED_BY_IMAGE_3_10}`,
      METHODS.POST,
      formData,
    );
    yield put(loadRelatedImageSuccess(responseImage.data));
  } catch (err) {
    yield put(loadRelatedImageError(err));
  }
}

export function* addBlackList(action) {
  const formData = new FormData();
  formData.append('image', action.data.image);
  formData.append('blacklistUser ', JSON.stringify(action.data.blacklistUser));
  // eslint-disable-next-line no-restricted-syntax
  for (const file of action.data.detectedImages) {
    formData.append('detectedImages', file, file.name);
  }

  yield put(setLoading());
  try {
    const responseImage = yield call(
      callApi,
      `${API_CAMERA_AI.ADD_USER_BLACKLIST_3_7}`,
      METHODS.POST,
      formData,
    );
    yield put(addBlackListSuccess(responseImage.data));
  } catch (err) {
    yield put(addBlackListError(err));
  }
}

export function* downloadFile(action) {
  yield put(setLoading());
  const axiosConfig = {
    // responseType: 'blob',
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    responseType: 'blob',
  };
  try {
    // yield call(
    //   getApi,
    //   `${API_CAMERA_AI.DOWNLOAD_BLACKLIST_3_2}?ids=${action.data.join(',')}`,
    // );
    const response = yield call(
      callApiWithConfig,
      `${API_CAMERA_AI.DOWNLOAD_BLACKLIST_3_2}?ids=${action.data.join(',')}`,
      METHODS.GET,
      {},
      axiosConfig,
    );
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Blacklist.xlsx`);
    link.click();
    yield put(downloadBlackListSuccess());
  } catch (err) {
    //----
    yield put(downloadBlackListError(err));
  }
}

export default function* blacklistCameraAiSaga() {
  yield takeLatest(LOAD_BLACKLIST, loadBlackList);
  yield takeLatest(DELETE_USER, deleteUser);
  yield takeLatest(LOAD_MOVEMENT_DETECTED_HISTORY, loadMovementDetectedHistory);
  yield takeLatest(UPDATE_NAME, updateUser);
  yield takeLatest(LOAD_RELATED_IMAGE, getListUserDetectedImage);
  yield takeLatest(ADD_BLACKLIST, addBlackList);
  yield takeLatest(DOWNLOAD_BLACKLIST, downloadFile);
}
