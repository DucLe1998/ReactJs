import { call, put, takeLatest } from 'redux-saga/effects';
import {
  loadListItemColorSuccess,
  loadListItemColorError,
  loadListItemTypeSuccess,
  loadListItemTypeError,
  showLoading,
  loadListItemCameraaiSuccess,
  loadListItemCameraaiError,
} from './actions';
import {
  LOAD_LIST_ITEMS_CAMERAAI,
  LOAD_LIST_ITEMS_COLOR,
  LOAD_LIST_ITEMS_TYPE,
} from './constants';
import { callApi, METHODS } from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';

export function* getListItemCameraAi(action) {
  yield put(showLoading());
  try {
    const response = yield call(
      callApi,
      `${API_CAMERA_AI.LIST_ITEMS_CAMERAAI_3_12}?${action.filterObj}`,
      METHODS.GET,
    );
    yield put(loadListItemCameraaiSuccess(response.data));
  } catch (err) {
    yield put(loadListItemCameraaiError(err));
  }
}

export function* getListItemsType() {
  try {
    const response = yield call(
      callApi,
      `${API_CAMERA_AI.LIST_ITEMS_TYPE_3_12}`,
      METHODS.GET,
    );
    yield put(loadListItemTypeSuccess(response.data));
  } catch (err) {
    yield put(loadListItemTypeError(err));
  }
}

export function* getListItemsColor() {
  try {
    const response = yield call(
      callApi,
      `${API_CAMERA_AI.LIST_ITEMS_COLOR_3_12}`,
      METHODS.GET,
    );
    yield put(loadListItemColorSuccess(response.data));
  } catch (err) {
    yield put(loadListItemColorError(err));
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_LIST_ITEMS_TYPE, getListItemsType);
  yield takeLatest(LOAD_LIST_ITEMS_COLOR, getListItemsColor);
  yield takeLatest(LOAD_LIST_ITEMS_CAMERAAI, getListItemCameraAi);
}
