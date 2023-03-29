import { call, put, takeLatest } from 'redux-saga/effects';
import { LOAD_DATA, LOAD_DATA_DETAIL, UPDATE, DELETE } from './constants';
import {
  loadDataSuccess,
  loadDataError,
  showLoading,
  loadDataDetailSuccess,
  loadDataDetailError,
  updateDeviceSuccess,
  deleteSuccess,
  addDeviceSuccess,
} from './actions';
import { callApi, getApi, METHODS } from '../../utils/requestUtils';
import { ARTICLES_SRC } from '../apiUrl';
import utils from '../../utils/utils';
// import utils from '../../utils/utils';

const urlMain = ARTICLES_SRC;

export function* getListData(action) {
  yield put(showLoading(true));
  try {
    const response = yield getApi(`${urlMain}/articles`, action.filterObj);
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

export function* onUpdateItem(v) {
  yield put(showLoading(true));
  try {
    const newUrl =
      v.dataSub.type === 'changeStatus'
        ? `${urlMain}/${v.dataSub.id}/change-status`
        : `${urlMain}/${v.dataSub.id}`;
    const response = yield call(
      callApi,
      newUrl,
      v.dataSub.type === 'changeStatus' ? METHODS.PATCH : METHODS.PUT,
      v.data,
    );
    utils.showToast('Thành công');
    yield put(updateDeviceSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export function* onDeleteArticle(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${urlMain}/articles/${action.data}`,
      METHODS.DELETE,
    );
    utils.showToast('Xóa tin tức thành công');
    yield put(deleteSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export function* onAddItem(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${urlMain}/accept-register-request`,
      METHODS.POST,
      action.filterObj,
    );
    utils.showToast('Thành công');
    yield put(addDeviceSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export default function* getData() {
  yield takeLatest(LOAD_DATA, getListData);
  yield takeLatest(UPDATE, onUpdateItem);
  yield takeLatest(LOAD_DATA_DETAIL, getDataDetail);
  yield takeLatest(DELETE, onDeleteArticle);
}
