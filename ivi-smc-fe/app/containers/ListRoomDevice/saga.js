import { call, put, takeLatest } from 'redux-saga/effects';
import { getApi } from 'utils/requestUtils';
import { API_BOOKING } from 'containers/apiUrl';
import { LOAD_DATA } from './constants';
import {
  loadDataSuccess,
  loadDataError,
} from './actions';
// let listOldQuery = '';
export function* getListData(action) {
  try {
    const response = yield call(
      getApi,
      API_BOOKING.DEVICE_API,
      action.filterObj,
    );
    yield put(loadDataSuccess(response));
  } catch (err) {
    yield put(loadDataError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_DATA, getListData);
}
