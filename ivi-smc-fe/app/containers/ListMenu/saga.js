import { call, put, takeLatest } from 'redux-saga/effects';
import { LOAD_DATA, LOAD_LIST_PARENT_MENU } from './constants';
import { API_IAM } from '../apiUrl';
import {
  loadDataSuccess,
  loadDataError,
  loadParentMenuSuccess,
  loadParentMenuError,
} from './actions';
const axios = require('axios');

export function* getListMenu(action) {
  const axiosConfig = {
    method: 'get',
    url: API_IAM.LIST_ALL_MENU_API + action.filterObj,
    withCredentials: true,
  };
  try {
    const response = yield call(axios, axiosConfig);
    const rows = response.data;
    const { count } = response.data.length;
    yield put(loadDataSuccess({ data: rows, totalCount: count }));
  } catch (err) {
    yield put(loadDataError(err));
  }
}

/**
 *
 * Lây danh sách cac loai su kien
 */
export function* getListParentMenu() {
  const axiosConfig = {
    method: 'get',
    url: API_IAM.LIST_ALL_MENU_API,
    withCredentials: true,
  };
  try {
    const response = yield call(axios, axiosConfig);
    yield put(
      loadParentMenuSuccess(
        response.data.map(item => ({
          id: item.id,
          code: item.functionCode,
          name: item.functionName,
        })),
      ),
    );
  } catch (err) {
    yield put(loadParentMenuError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_DATA, getListMenu);
  yield takeLatest(LOAD_LIST_PARENT_MENU, getListParentMenu);
}
