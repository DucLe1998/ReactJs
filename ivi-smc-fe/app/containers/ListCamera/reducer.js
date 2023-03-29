/*
 *
 * ListCamera reducer
 *
 */
// import { getErrorMessage } from 'containers/Common/function';
// import { showError } from 'utils/toast-utils';
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_LOADING,
  SET_OPEN_DRAWER,
  SET_PAGE,
  LOAD_LIST_CAMERA_SUCCESS,
  LOAD_LIST_CAMERA_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  openDetailsDrawer: false,
  selectedItem: null,
  needReload: 0,
  page: 1,
  cameraData: { data: [], totalRow: 0, totalPage: 0 },
};

/* eslint-disable default-case, no-param-reassign */
const listCameraReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_LOADING:
        draft.loading = action.status;
        break;
      case SET_OPEN_DRAWER:
        draft.openDetailsDrawer = action.status;
        draft.selectedItem = null;
        break;
      case SET_PAGE:
        draft.page = action.page;
        break;
      case LOAD_LIST_CAMERA_SUCCESS:
        draft.loading = false;
        draft.cameraData = action.data;
        break;
      case LOAD_LIST_CAMERA_ERROR:
        draft.loading = false;
        draft.error = action.err;
        break;
    }
  });

export default listCameraReducer;
