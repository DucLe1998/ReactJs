/*
 *
 * HumanDashboard reducer
 *
 */
// import { showError, showSuccess } from 'utils/toast-utils';
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_LOADING,
  SET_OPEN_DRAWER,
  SET_PAGE,
  LOAD_LIST_ERROR,
  LOAD_LIST_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  openDetailsDrawer: false,
  selectedItem: null,
  needReload: 0,
  page: 1,
  data: { rows: [], count: 0, totalPage: 0 },
};

/* eslint-disable default-case, no-param-reassign */
const humanDashboardReducer = (state = initialState, action) =>
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
      case LOAD_LIST_SUCCESS:
        draft.loading = false;
        draft.data = action.data;
        if (state.page > 1 && action.data.length == 0) {
          draft.page = state.page - 1;
        }
        break;
      case LOAD_LIST_ERROR:
        draft.loading = false;
        draft.error = action.err;
        break;
    }
  });

export default humanDashboardReducer;
