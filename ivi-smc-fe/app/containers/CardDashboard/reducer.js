/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_DATA_DETAIL_SUCCESS,
  LOAD_DATA_DETAIL_ERROR,
  DOWNLOAD_CARD_DASHBOARD_SUCCESS,
  DOWNLOAD_COMPANY_CARD_DASHBOARD_SUCCESS,
  DOWNLOAD_ALL_COMPANY_CARD_DASHBOARD_SUCCESS,
} from './constants';
import { getErrorMessage } from '../Common/function';
// The initial state of the App
export const initialState = {
  data: null,
  dataDetail: '',
  error: '',
  loading: true,
  isReloading: false,
};

const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_DATA:
        draft.loading = true;
        break;
      case LOAD_DATA_DETAIL_SUCCESS:
        draft.dataDetail = action.data;
        draft.loading = false;
        draft.error = '';
        break;
      case DOWNLOAD_CARD_DASHBOARD_SUCCESS:
        draft.loading = false;
        draft.error = '';
        draft.isReloading = false;
        break;
      case DOWNLOAD_COMPANY_CARD_DASHBOARD_SUCCESS:
        draft.loading = false;
        draft.error = '';
        draft.isReloading = false;
        break;
      case DOWNLOAD_ALL_COMPANY_CARD_DASHBOARD_SUCCESS:
        draft.loading = false;
        draft.error = '';
        draft.isReloading = false;
        break;
      case LOAD_DATA_DETAIL_ERROR:
        draft.dataDetail = '';
        draft.error = getErrorMessage(action.err);
        draft.loading = false;
        break;
      case LOAD_DATA_SUCCESS:
        draft.data = action.data;
        draft.loading = false;
        draft.error = '';
        draft.isReloading = false;
        break;
      case LOAD_DATA_ERROR:
        draft.data = { rows: [], totalCount: 0 };
        draft.error = getErrorMessage(action.err);
        draft.loading = false;
        break;
      case SHOW_LOADING:
        draft.loading = action.isLoading;
        break;
      default:
        break;
      // draft.loading = true;
    }
  });

export default loginReducer;
