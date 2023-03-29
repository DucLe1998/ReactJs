import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { callApi, METHODS } from '../../utils/requestUtils';
import {
  addDVKNSuccess,
  addUserSuccess,
  deleteDVKNSuccess,
  deleteRoleSuccess,
  deleteUserSuccess,
  loadAuthoritySuccess,
  loadData,
  loadDataError,
  loadDataSuccess,
  loadDVKNSuccess,
  loadError,
  loadPositionSuccess,
  loadUnitSuccess,
  loadUserSuccess,
  showLoading,
  updateDVKNSuccess,
  updateStatusUserSuccess,
  updateUserSuccess,
} from './actions';
import { API_IAM } from '../apiUrl';
import {
  ADD_DVKN,
  ADD_USER,
  DELETE_DVKN,
  DELETE_ROLE,
  DELETE_USER,
  LOAD_AUTHORITY,
  LOAD_DATA,
  LOAD_DON_VI_KIEM_NHIEM,
  LOAD_POSITION,
  LOAD_UNIT,
  LOAD_USER,
  UPDATE_DVKN,
  UPDATE_STATUS_USER,
  UPDATE_USER,
} from './constants';

let listUserOldQuery = '';
export function* getListData(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      API_IAM.USER_SEARCH_LIST +
        (action.filterObj ? action.filterObj : listUserOldQuery),
      METHODS.GET,
    );
    listUserOldQuery = action.filterObj;
    yield put(loadDataSuccess(response.data));
  } catch (err) {
    yield put(loadDataError(err));
  }
}

export function* getListUnit() {
  // yield put(showLoading(true));
  try {
    const response = yield call(callApi, API_IAM.ORG_UNIT, METHODS.GET);
    yield put(loadUnitSuccess(response?.data?.rows));
  } catch (err) {
    yield put(loadError('units'));
  }
}

export function* getListPosition() {
  // yield put(showLoading(true));
  try {
    const response = yield call(callApi, API_IAM.POSITION_ALL, METHODS.GET);
    yield put(loadPositionSuccess(response?.data));
  } catch (err) {
    yield put(loadError('positions'));
  }
}

export function* getListAuthorities() {
  // yield put(showLoading(true));
  try {
    const response = yield call(callApi, API_IAM.LIST_POLICY, METHODS.GET);
    yield put(loadAuthoritySuccess(response?.data));
  } catch (err) {
    yield put(loadError('authorities'));
  }
}

export function* getUser(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      API_IAM.USER_DETAIL_BY_ID.replace('@userId', action.userId),
      METHODS.GET,
    );
    yield put(loadUserSuccess(response.data));
  } catch (err) {
    yield put(loadError('user'));
  }
}

export function* addUser(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      API_IAM.USER,
      METHODS.POST,
      action.data,
    );
    yield put(loadData());
    yield put(addUserSuccess(response.data));
  } catch (err) {
    yield put(loadError('user'));
  }
}

export function* updateUser(action) {
  yield put(showLoading(true));
  try {
    const data = {
      default: true,
      email: action.data.email,
      employeeCode: action.data.employeeCode.trim(),
      fullName: action.data.fullName.trim(),
      leader: action.data.leadershipUnit,
      mobile: action.data.phone,
      orgUnitId: action.data.unit,
      positionId: action.data.position ? action.data.position : 1,
      status: action.data.status ? 'ACTIVE' : 'UN_ACTIVE',
      username: action.data.username,
      workPhone: action.data.landlinePhone,
      workPhoneExt: action.data.ext,
    };
    yield call(callApi, API_IAM.USER, METHODS.PUT, data);
    yield put(updateUserSuccess());
    yield put(loadData());
  } catch (err) {
    yield put(loadError());
  }
}

export function* deleteUser(action) {
  yield put(showLoading(true));
  try {
    yield call(
      callApi,
      API_IAM.DELETE_USER.replace('@username', action.data),
      METHODS.DELETE,
    );
    yield put(deleteUserSuccess());
  } catch (err) {
    yield put(loadError('user'));
  }
}

export function* updateStatusUser({ data }) {
  yield put(showLoading(true));
  try {
    const value = {
      value: data?.value?.id,
      enabled: data?.enabled,
    };
    yield call(callApi, API_IAM.USER_ENABLE(value), METHODS.PUT);
    yield put(updateStatusUserSuccess());
  } catch (err) {
    yield put(loadError());
  }
}

export function* loadDVKN(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      API_IAM.USER_ORG_UNIT_LIST.replace('@userId', action.data),
      METHODS.GET,
    );
    yield put(loadDVKNSuccess(response?.data));
  } catch (err) {
    yield put(loadError('DVKN'));
  }
}

export function* updateDVKN(action) {
  yield put(showLoading(true));
  try {
    yield call(callApi, API_IAM.USER_ORG_UNIT, METHODS.PUT, action.data);
    yield put(updateDVKNSuccess());
  } catch (err) {
    yield put(loadError());
  }
}

export function* addDVKN(action) {
  yield put(showLoading(true));
  try {
    yield call(callApi, API_IAM.USER_ORG_UNIT, METHODS.POST, action.data);
    yield put(addDVKNSuccess());
  } catch (err) {
    yield put(loadError());
  }
}

export function* deleteDVKN(action) {
  yield put(showLoading(true));
  try {
    yield call(
      callApi,
      API_IAM.USER_ORG_UNIT_DELETE.replace(
        '@orgUnitId',
        action.data.orgUnitId,
      ).replace('@userId', action.data.userId),
      METHODS.DELETE,
    );
    yield put(deleteDVKNSuccess());
  } catch (err) {
    yield put(loadError());
  }
}

export function* deleteRole(action) {
  yield put(showLoading(true));
  try {
    yield call(
      callApi,
      API_IAM.POLICY_DELETE.replace('@id', action.id),
      METHODS.DELETE,
    );
    yield put(deleteRoleSuccess());
  } catch (err) {
    yield put(loadError());
  }
}

export default function* userSaga() {
  yield debounce(500, LOAD_DATA, getListData);
  yield debounce(500, LOAD_UNIT, getListUnit);
  yield debounce(500, LOAD_POSITION, getListPosition);
  yield debounce(500, LOAD_AUTHORITY, getListAuthorities);
  yield debounce(500, LOAD_USER, getUser);
  yield takeLatest(ADD_USER, addUser);
  yield takeLatest(UPDATE_USER, updateUser);
  yield takeLatest(DELETE_USER, deleteUser);
  yield takeLatest(UPDATE_STATUS_USER, updateStatusUser);
  yield takeLatest(LOAD_DON_VI_KIEM_NHIEM, loadDVKN);
  yield takeLatest(UPDATE_DVKN, updateDVKN);
  yield takeLatest(DELETE_DVKN, deleteDVKN);
  yield takeLatest(ADD_DVKN, addDVKN);
  yield takeLatest(DELETE_ROLE, deleteRole);
}
