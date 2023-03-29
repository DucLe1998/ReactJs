/* eslint-disable no-param-reassign */
import produce from 'immer';
import { showError } from 'utils/toast-utils';
import {
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_DATA_DETAIL_SUCCESS,
  LOAD_DATA_DETAIL_ERROR,
  UPDATE_SUCCESS,
  CHANGE_FIELD,
  DELETE_SUCCESS,
  ADD_SUCCESS,
} from './constants';
// The initial state of the App
export const initialState = {
  data: [],
  dataDetail: '',
  error: '',
  loading: true,
  isReloading: false,
};

const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_FIELD:
        draft[action.field] = action.value;
        break;

      case ADD_SUCCESS:
        draft.loading = false;
        draft.error = '';
        draft.isReloading = true;
        break;

      case UPDATE_SUCCESS:
        draft.loading = false;
        draft.error = '';
        draft.isReloading = true;
        break;

      case DELETE_SUCCESS:
        draft.loading = false;
        draft.error = '';
        draft.isReloading = true;
        break;

      case LOAD_DATA_DETAIL_SUCCESS:
        draft.dataDetail = action.data;
        draft.loading = false;
        draft.error = '';
        break;

      case LOAD_DATA_DETAIL_ERROR:
        draft.dataDetail = '';
        // draft.error = getErrorMessage(action.err);
        showError(action.err);
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
        // draft.error = getErrorMessage(action.err);
        showError(action.err);
        draft.loading = false;
        break;

      case SHOW_LOADING:
        draft.loading = action.isLoading;
        break;
      default:
        break;
    }
  });

export default loginReducer;
