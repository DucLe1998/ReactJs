/*
 *
 * Library reducer
 *
 */
import { showError, showSuccess } from 'utils/toast-utils';
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_LOADING,
  SET_PAGE,
  LOAD_LIST_FILE_ERROR,
  LOAD_LIST_FILE_SUCCESS,
  DELETE_FILE_ERROR,
  DELETE_FILE_SUCCESS,
  DOWNLOAD_FILE_ERROR,
  DOWNLOAD_FILE_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  needReload: 0,
  page: 1,
  fileData: { data: [], totalRow: 0, totalPage: 0 },
};

/* eslint-disable default-case, no-param-reassign */
const libraryReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_LOADING:
        draft.loading = action.status;
        break;
      case SET_PAGE:
        draft.page = action.page;
        break;
      case LOAD_LIST_FILE_SUCCESS:
        draft.loading = false;
        draft.fileData = action.data;
        if (state.page > 1 && action.data.length == 0) {
          draft.page = state.page - 1;
        }
        break;
      case LOAD_LIST_FILE_ERROR:
        draft.loading = false;
        draft.error = action.err;
        break;
      case DELETE_FILE_SUCCESS:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        showSuccess('Xóa tệp thành công');
        break;
      case DELETE_FILE_ERROR:
        draft.loading = false;
        showError(action.err);
        break;
      case DOWNLOAD_FILE_SUCCESS:
        draft.loading = false;
        break;
      case DOWNLOAD_FILE_ERROR:
        draft.loading = false;
        showError(action.err);
        break;
    }
  });

export default libraryReducer;
