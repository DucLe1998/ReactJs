import { call, put, takeLatest } from 'redux-saga/effects';
import { LIST_NOTIFICATION_API } from '../apiUrl';
import { loadNotificationError, loadNotificationSuccess } from './actions';
import { LOAD_LIST_NOTIFY } from './constants';
const axios = require('axios');

export function* getListNotification(action) {
  // const axiosConfig = {
  //   method: 'get',
  //   url: LIST_NOTIFICATION_API + action.filterQuery,
  //   withCredentials: true,
  // };
  // try {
  //   const response = yield call(axios, axiosConfig);
  //   yield put(loadNotificationSuccess(response.data));
  // } catch (err) {
  //   yield put(loadNotificationError(err));
  // }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_LIST_NOTIFY, getListNotification);
}
