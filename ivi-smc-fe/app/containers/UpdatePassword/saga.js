// import { take, call, put, select } from 'redux-saga/effects';
import { put, takeLatest } from 'redux-saga/effects';
// import { API_IAM } from '../apiUrl';
import { updatePasswordError, updatePasswordSuccess, loading } from './actions';
import { UPDATE_PASSWORD } from './constants';
import { showSuccess } from '../../utils/toast-utils';
// const axios = require('axios');

export function* updatePassword(action) {
  yield put(loading(true));
  // const axiosConfig = {
  //   method: 'post',
  //   url: API_IAM.CONFIRM_FORGOT_PASSWORD_API,
  //   data: {
  //     email: action.data.email,
  //     confirmationCode: action.data.confirmationCode,
  //     newPassword: action.data.newPassword,
  //   },
  // };
  try {
    // const response = yield call(axios, axiosConfig);
    showSuccess(action.data.successMessage);
    yield put(updatePasswordSuccess());
  } catch (err) {
    yield put(updatePasswordError(err));
  }
}
// Individual exports for testing
export default function* updatePasswordSaga() {
  yield takeLatest(UPDATE_PASSWORD, updatePassword);
}
