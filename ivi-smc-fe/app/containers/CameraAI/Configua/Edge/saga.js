import { call, put, takeLatest } from 'redux-saga/effects';
import { LOAD_DATA, LOAD_DATA_DETAIL, UPDATE, DELETE, ADD } from './constants';
import {
  loadDataSuccess,
  loadDataError,
  showLoading,
  loadDataDetailSuccess,
  loadDataDetailError,
  updateItemSuccess,
  deleteItemSuccess,
  addItemSuccess,
} from './actions';
import { callApi, METHODS } from '../../../../utils/requestUtils';
import { CAMERA_AI_API_SRC } from '../../../apiUrl';
import utils from '../../../../utils/utils';
// import utils from '../../utils/utils';

const urlMain = `${CAMERA_AI_API_SRC}/fpgaManagers`;

export function* getListData(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${urlMain}?${action.filterObj}`,
      METHODS.GET,
    );

    yield put(loadDataSuccess(response.data));
  } catch (err) {
    yield put(loadDataError(err));
    utils.showToast(err.response?.data?.message, 'error');
  }
}

export function* getDataDetail(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${urlMain}/${action.filterObj.id}`,
      METHODS.GET,
    );
    yield put(loadDataDetailSuccess(response.data));
  } catch (err) {
    yield put(loadDataDetailError(err));
    utils.showToast(err.response?.data?.message, 'error');
  }
}

export function* onUpdate(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${urlMain}/${action.id}`,
      METHODS.PUT,
      action.filterObj,
    );
    utils.showToast('Thành công');
    yield put(updateItemSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export function* onDelete(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${urlMain}/${action.filterObj.id}`,
      METHODS.DELETE,
    );
    utils.showToast('Thành công');
    yield put(deleteItemSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export function* onAdd(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${urlMain}`,
      METHODS.POST,
      action.filterObj,
    );
    utils.showToast('Thành công');
    yield put(addItemSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export default function* getData() {
  yield takeLatest(LOAD_DATA, getListData);
  yield takeLatest(UPDATE, onUpdate);
  yield takeLatest(LOAD_DATA_DETAIL, getDataDetail);
  yield takeLatest(DELETE, onDelete);
  yield takeLatest(ADD, onAdd);
}
