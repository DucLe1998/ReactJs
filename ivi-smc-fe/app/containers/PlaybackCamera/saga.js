import { call, put, takeLatest } from 'redux-saga/effects';
import {
  LOAD_DATA,
  ADD_CAMERA_TO_PLAYBACK,
  LOAD_DATA_PLAYBACK,
} from './constants';
import {
  loadDataSuccess,
  loadDataError,
  showLoading,
  addCamToViewSuccess,
  loadDataPlaybackSuccess,
} from './actions';
import { callApi, METHODS } from '../../utils/requestUtils';
import { API_ROUTE } from '../apiUrl';
import utils from '../../utils/utils';

const urlMain = `${API_ROUTE.LIVE_VIEW}/playback`;

export function* getListData(action) {
  yield put(showLoading(true));
  try {
    if (action.filterObj && action.filterObj.type === 'filter') {
      const { dto } = action.filterObj;
      const response = yield call(
        callApi,
        `${urlMain}/playback-action`,
        METHODS.POST,
        dto,
      );
      yield put(loadDataSuccess({ devices: response.data }));
    } else {
      const response = yield call(callApi, `${urlMain}`, METHODS.GET);
      yield put(loadDataSuccess(response.data));
      yield put(showLoading(false));
    }
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(loadDataError(err));
  }
}

export function* getDataPlayback(action) {
  yield put(showLoading(true));
  try {
    const { dto } = action.filterObj;
    const response = yield call(
      callApi,
      `${urlMain}/playback-action`,
      METHODS.POST,
      dto,
    );
    yield put(loadDataPlaybackSuccess({ devices: response.data }));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(loadDataError(err));
  }
}

export function* addCamToView(action) {
  yield put(showLoading(true));
  try {
    const { type } = action.filterObj;
    const response = yield call(
      callApi,
      `${urlMain}/${type === 'add' ? 'add' : 'delete'}-cam`,
      type === 'add' ? METHODS.PUT : METHODS.DELETE,
      action.filterObj.dto,
    );
    yield put(addCamToViewSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_DATA, getListData);
  yield takeLatest(LOAD_DATA_PLAYBACK, getDataPlayback);
  yield takeLatest(ADD_CAMERA_TO_PLAYBACK, addCamToView);
}
