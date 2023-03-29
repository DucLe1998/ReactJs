import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_DATA_DETAIL,
  LOAD_DATA_DETAIL_SUCCESS,
  LOAD_DATA_DETAIL_ERROR,
  DOWNLOAD_CARD_DASHBOARD,
  DOWNLOAD_CARD_DASHBOARD_SUCCESS,
  DOWNLOAD_COMPANY_CARD_DASHBOARD,
  DOWNLOAD_COMPANY_CARD_DASHBOARD_SUCCESS,
  DOWNLOAD_ALL_COMPANY_CARD_DASHBOARD,
  DOWNLOAD_ALL_COMPANY_CARD_DASHBOARD_SUCCESS,
} from './constants';

export function loadData(filterObj) {
  return {
    type: LOAD_DATA,
    filterObj,
  };
}

export function loadDataSuccess(data) {
  return {
    type: LOAD_DATA_SUCCESS,
    data,
  };
}

export function loadDataError(err) {
  return {
    type: LOAD_DATA_ERROR,
    err,
  };
}

export function showLoading(isLoading) {
  return {
    type: SHOW_LOADING,
    isLoading,
  };
}

export function loadDataDetail(filterObj) {
  return {
    type: LOAD_DATA_DETAIL,
    filterObj,
  };
}

export function loadDataDetailSuccess(data) {
  return {
    type: LOAD_DATA_DETAIL_SUCCESS,
    data,
  };
}

export function loadDataDetailError(err) {
  return {
    type: LOAD_DATA_DETAIL_ERROR,
    err,
  };
}

export function downloadCardDashBoard(filterObj) {
  return {
    type: DOWNLOAD_CARD_DASHBOARD,
    filterObj,
  };
}

export function downloadCardDashBoardSuccess(data) {
  return {
    type: DOWNLOAD_CARD_DASHBOARD_SUCCESS,
    data,
  };
}

export function downloadCompanyCardDashBoard(filterObj) {
  return {
    type: DOWNLOAD_COMPANY_CARD_DASHBOARD,
    filterObj,
  };
}

export function downloadCompanyCardDashBoardSuccess(data) {
  return {
    type: DOWNLOAD_COMPANY_CARD_DASHBOARD_SUCCESS,
    data,
  };
}

export function downloadAllCompanyCardDashBoard(filterObj) {
  return {
    type: DOWNLOAD_ALL_COMPANY_CARD_DASHBOARD,
    filterObj,
  };
}

export function downloadAllCompanyCardDashBoardSuccess(data) {
  return {
    type: DOWNLOAD_ALL_COMPANY_CARD_DASHBOARD_SUCCESS,
    data,
  };
}
