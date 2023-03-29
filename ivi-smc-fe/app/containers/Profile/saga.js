// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  showLoading,
  loadProfileSuccess,
  loadProfileError,
  changePasswordProfileSuccess,
  changePasswordProfileError,
} from './actions';
import { CHANGE_PASSWORD_PROFILE, LOAD_PROFILE } from './constants';
import { callApi, METHODS } from '../../utils/requestUtils';
import { API_IAM } from '../apiUrl';
import { showSuccess } from '../../utils/toast-utils';

/**
 *
 * Lấy thông tin cá nhân
 */
export function* loadProfile() {
  yield put(showLoading());
  try {
    const response = yield call(callApi, `${API_IAM.PROFILE}`, METHODS.GET);
    yield put(loadProfileSuccess(response.data));
  } catch (err) {
    yield put(loadProfileError(err));
  }
}

export function* profileChangePassword(action) {
  yield put(showLoading());
  try {
    const axiosConfig = {
      method: METHODS.PATCH,
      url: API_IAM.PROFILE_CHANGE_PASSWORD,
      data: {
        currentPassword: action.request.currentPassword,
        newPassword: action.request.newPassword,
      },
    };
    const response = yield call(axios, axiosConfig);
    showSuccess('Thay đổi mật khẩu thành công');
    yield put(changePasswordProfileSuccess(response));
  } catch (err) {
    yield put(changePasswordProfileError(err));
  }
}

// Individual exports for testing
export default function* profileSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOAD_PROFILE, loadProfile);
  yield takeLatest(CHANGE_PASSWORD_PROFILE, profileChangePassword);
}
