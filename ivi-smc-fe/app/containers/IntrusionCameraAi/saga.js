import { call, put, takeLatest } from 'redux-saga/effects';
import { loadDataError, loadDataSuccess, showLoading } from './actions';
import { LOAD_BROADCAST, LOAD_DATA, UPDATE_DATA } from './constants';
import { callApi, METHODS } from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';

export function* getDataDetail(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${API_CAMERA_AI.DATA_INTRUSION_EVENT_3_5}/${
        action.filterObj
      }/enter-forbidden-area`,
      METHODS.GET,
    );
    yield put(loadDataSuccess(response.data));
  } catch (err) {
    yield put(loadDataError(err));
  }
}

export function* updateData(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${API_CAMERA_AI.DATA_INTRUSION_EVENT_3_5}/${action.id}/description`,
      METHODS.PUT,
      action.data,
    );
    yield put(loadDataSuccess(response.data));
  } catch (err) {
    yield put(loadDataError(err));
  }
}

export function* getBroadCast(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `http://technopark.dev.vsm.net/tnp/cameraai/api/v0/broadcast/live-stream/area/${
        action.areaId
      }/device/${action.deviceId}`,
      METHODS.GET,
    );
    yield put(loadDataSuccess(response.data));
  } catch (err) {
    yield put(loadDataError(err));
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_DATA, getDataDetail);
  yield takeLatest(UPDATE_DATA, updateData);
  yield takeLatest(LOAD_BROADCAST, getBroadCast);
}
