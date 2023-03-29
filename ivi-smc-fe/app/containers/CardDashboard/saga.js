import { call, put, takeLatest } from 'redux-saga/effects';
import FileSaver from 'file-saver';
import {
  DOWNLOAD_ALL_COMPANY_CARD_DASHBOARD,
  DOWNLOAD_CARD_DASHBOARD,
  DOWNLOAD_COMPANY_CARD_DASHBOARD,
  LOAD_DATA,
  LOAD_DATA_DETAIL,
} from './constants';
import {
  loadDataSuccess,
  loadDataError,
  showLoading,
  loadDataDetailSuccess,
  loadDataDetailError,
  downloadCardDashBoardSuccess,
} from './actions';
import { callApi, callApiExportFile, METHODS } from '../../utils/requestUtils';
import { API_ROUTE } from '../apiUrl';
import utils from '../../utils/utils';
// import utils from '../../utils/utils';

const urlMain = API_ROUTE.ACCESS_CONTROL_DEVICE;

export function* getListData(action) {
  yield put(showLoading(true));
  try {
    const response = yield call(
      callApi,
      `${urlMain}/cards/statistics`,
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
      `${urlMain}/cards/${action.filterObj.id}`,
      METHODS.GET,
    );
    yield put(loadDataDetailSuccess(response.data));
  } catch (err) {
    yield put(loadDataDetailError(err));
    utils.showToast(err.response?.data?.message, 'error');
  }
}

export function* onDownloadCardDashboard(action) {
  try {
    yield put(showLoading(true));
    const response = yield call(
      callApiExportFile,
      `${urlMain}/cards/statistics/download?downloadMode=${
        action.filterObj.modeDownload
      }&startTime=${action.filterObj.startTime}&endTime=${
        action.filterObj.endTime
      }`,
      'GET',
    );
    FileSaver.saveAs(
      response,
      `card_dashboard_${action.filterObj.startTime}.xlsx`,
    );
    // yield delay(300);
    yield put(downloadCardDashBoardSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export function* onDownloadCompanyCardDashboard(action) {
  try {
    yield put(showLoading(true));
    const response = yield call(
      callApiExportFile,
      `${urlMain}/cards/download-card?orgUnitId=${
        action.filterObj.companyId
      }&isGuest=${action.filterObj.isGuest}`,
      'GET',
    );
    FileSaver.saveAs(
      response,
      `card_dashboard_${action.filterObj.companyId}.xlsx`,
    );
    // yield delay(300);
    yield put(downloadCardDashBoardSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export function* onDownloadAllCompanyCardDashboard(action) {
  try {
    yield put(showLoading(true));
    const response = yield call(
      callApiExportFile,
      `${urlMain}/cards/card/download-company-card`,
      'GET',
    );
    FileSaver.saveAs(response, `card_dashboard.xlsx`);
    // yield delay(300);
    yield put(downloadCardDashBoardSuccess(response));
  } catch (err) {
    utils.showToast(err.response?.data?.message, 'error');
    yield put(showLoading(false));
  }
}

export default function* getData() {
  yield takeLatest(LOAD_DATA, getListData);
  yield takeLatest(LOAD_DATA_DETAIL, getDataDetail);
  yield takeLatest(DOWNLOAD_CARD_DASHBOARD, onDownloadCardDashboard);
  yield takeLatest(
    DOWNLOAD_COMPANY_CARD_DASHBOARD,
    onDownloadCompanyCardDashboard,
  );
  yield takeLatest(
    DOWNLOAD_ALL_COMPANY_CARD_DASHBOARD,
    onDownloadAllCompanyCardDashboard,
  );
}
