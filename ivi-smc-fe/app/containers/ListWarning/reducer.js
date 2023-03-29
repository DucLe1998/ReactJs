/*
 *
 * ListWarning reducer
 *
 */
import { showError, showSuccess } from 'utils/toast-utils';
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_LOADING,
  SET_OPEN_DRAWER,
  SET_PAGE,
  LOAD_LIST_WARNING_SUCCESS,
  LOAD_LIST_WARNING_ERROR,
  INFO_WARNING_SUCCESS,
  INFO_WARNING_ERROR,
  EDIT_WARNING_SUCCESS,
  EDIT_WARNING_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  openDetailsDrawer: false,
  selectedItem: null,
  needReload: 0,
  page: 1,
  warningData: { data: [], totalRow: 0, totalPage: 0 },
};

/* eslint-disable default-case, no-param-reassign */
const listWarningReducer = (state = initialState, action) =>
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
      case SET_OPEN_DRAWER:
        draft.openDetailsDrawer = action.status;
        break;
      case LOAD_LIST_WARNING_SUCCESS:
        draft.loading = false;
        draft.warningData = action.data;
        if (state.page > 1 && action.data.length == 0) {
          draft.page = state.page - 1;
        }
        break;
      case LOAD_LIST_WARNING_ERROR:
        draft.loading = false;
        draft.error = action.err;
        break;
      case INFO_WARNING_SUCCESS:
        draft.loading = false;
        draft.selectedItem = action.data;
        draft.openDetailsDrawer = true;
        break;
      case INFO_WARNING_ERROR:
        draft.loading = false;
        showError(action.err);
        break;
      case EDIT_WARNING_SUCCESS:
        draft.needReload = state.needReload + 1;
        draft.openDetailsDrawer = false;
        showSuccess('Cập nhật cảnh báo thành công');
        break;
      case EDIT_WARNING_ERROR:
        draft.loading = false;
        showError(action.err);
        break;
    }
  });

export default listWarningReducer;
