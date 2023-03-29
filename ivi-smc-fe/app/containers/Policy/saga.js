import { call, put, takeLatest } from 'redux-saga/effects';
import { showSuccess, showError } from 'utils/toast-utils';
import { API_IAM, API_CMS } from '../apiUrl';
import { getErrorMessage } from '../Common/function';
import { callApi, getApi, METHODS } from '../../utils/requestUtils';
import {
  deletePolicySuccess,
  loadPolicyFail,
  loadPolicySuccess,
  showLoading,
  detailPolicySuccess,
  editRowSuccess,
  getMenuIDSuccess,
  addNewRowSuccess,
} from './actions';

import {
  ADD_NEW,
  DELETE_POLICY,
  EDIT_POLICY,
  GET_POLICY_ACTION,
  LOAD_DETAIL,
  LOAD_MENU_ID,
} from './constants';
export function* listPolicySaga(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${API_IAM.LIST_POLICY}/search?${action.payload}`,
      METHODS.GET,
    );
    yield put(loadPolicySuccess(response.data));
  } catch (err) {
    yield put(loadPolicyFail(err));
    showError(getErrorMessage(err));
  }
}
export function* getDetailPolicy({ id }) {
  try {
    const responseDetail =
      id == 'new'
        ? {
            data: {
              description: '',
              policyCode: '',
              policyName: '',
              policyId: 'new',
              scopes: [],
              status: 'ACTIVE',
            },
          }
        : yield call(callApi, `${API_IAM.LIST_POLICY}/${id}`, METHODS.GET);
    const responseResource = yield call(
      getApi,
      API_IAM.LIST_RESOURCE,
      METHODS.GET,
    );
    const groupByCode = responseDetail.data.scopes.reduce(
      (total, cur) => ({
        ...total,
        [cur.resourceCode]: (total[cur.resourceCode] || []).concat(cur.scope),
      }),
      {},
    );
    const mergeData = responseResource.data.map(cur => ({
      resourceCode: cur.resourceCode,
      resourceName: cur.resourceName,
      scopes: groupByCode[cur.resourceCode] || [],
      allowScopes: cur.allowScopes.map(v => v.scope),
      tenantId: cur.tenantId,
    }));
    const { data } = responseDetail;
    yield put(detailPolicySuccess({ ...data, scopes: mergeData }));
  } catch (err) {
    yield put(showLoading(false));
    showError(getErrorMessage(err));
  }
}
export function* getMenuId({ id }) {
  try {
    const responseDetail =
      id == 'new'
        ? { data: [] }
        : yield call(
            callApi,
            `${API_CMS.MENU_API_DETAIL}/${id}/menus`,
            METHODS.GET,
          );
    const responseAll = yield call(
      getApi,
      `${API_CMS.MENU_API_DEV}?active=true`,
      METHODS.GET,
    );
    const hash = responseDetail.data.reduce(
      (total, cur) => ({ ...total, [cur.id]: cur }),
      {},
    );
    const mergeData = responseAll.data.map(row => {
      const read = Boolean(hash[row.id]);
      return {
        ...row,
        read,
      };
    });
    yield put(getMenuIDSuccess(mergeData));
  } catch (err) {
    yield put(showLoading(false));
    showError(getErrorMessage(err));
  }
}
export function* deletePolicy(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${API_IAM.LIST_POLICY}/${action.rows}`,
      METHODS.DELETE,
    );
    showSuccess('Xóa thành công');
    yield put(deletePolicySuccess(response));
  } catch (err) {
    yield put(showLoading(false));
    showError(getErrorMessage(err));
  }
}
export function* addNewRow({ data, menu }) {
  try {
    yield put(showLoading(true));
    const response = yield call(callApi, API_IAM.LIST_POLICY, 'post', data);
    yield call(callApi, API_CMS.MENU_API_DEV_POLICY, METHODS.POST, {
      menuIds: menu,
      policyIds: [response.data.policyId],
    });
    showSuccess('Thêm mới thành công');
    yield put(addNewRowSuccess(response));
  } catch (err) {
    yield put(showLoading(false));
    showError(getErrorMessage(err));
  }
}
export function* editRow(action) {
  try {
    yield put(showLoading(true));
    const response = yield call(
      callApi,
      `${API_IAM.LIST_POLICY}/${action.id}`,
      METHODS.PUT,
      action.data,
    );
    yield call(callApi, API_CMS.MENU_API_DEV_POLICY, METHODS.POST, {
      menuIds: action.listMenuId,
      policyIds: [action.id],
    });
    showSuccess('Chỉnh sửa thành công');
    yield put(editRowSuccess(response));
  } catch (err) {
    yield put(showLoading(false));
    showError(getErrorMessage(err));
  }
}
// Individual exports for testing
export default function* policySaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(ADD_NEW, addNewRow);
  yield takeLatest(EDIT_POLICY, editRow);
  yield takeLatest(GET_POLICY_ACTION, listPolicySaga);
  // yield takeLatest(GET_POLICY_RESOURCE_ACTION, listResourceSaga);
  yield takeLatest(DELETE_POLICY, deletePolicy);
  yield takeLatest(LOAD_DETAIL, getDetailPolicy);
  yield takeLatest(LOAD_MENU_ID, getMenuId);
}
