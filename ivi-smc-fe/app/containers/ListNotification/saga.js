import { call, put, takeLatest } from 'redux-saga/effects';
import { LOAD_DATA, MARK_AS_READ } from './constants';
import { LIST_NOTIFICATION_API } from '../apiUrl';
import {
  loadDataSuccess,
  loadDataError,
  markAsReadSuccess,
  markAsReadError,
} from './actions';
// import { showError, showSuccess } from '../../utils/toast-utils';
const axios = require('axios');

export function* getListNotification(action) {
  const axiosConfig = {
    method: 'get',
    url: LIST_NOTIFICATION_API + action.filterQuery,
    withCredentials: true,
  };
  try {
    const response = yield call(axios, axiosConfig);
    yield put(loadDataSuccess(response.data));
  } catch (err) {
    yield put(loadDataError(err));
  }
}
export function* markAsRead(action) {
  const axiosConfig = {
    method: 'put',
    url: LIST_NOTIFICATION_API + action.data,
    withCredentials: true,
  };
  try {
    const response = yield call(axios, axiosConfig);
    yield put(markAsReadSuccess(response.data));
  } catch (err) {
    yield put(markAsReadError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_DATA, getListNotification);
  yield takeLatest(MARK_AS_READ, markAsRead);
}
