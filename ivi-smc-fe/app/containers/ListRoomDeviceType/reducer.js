/* eslint-disable no-param-reassign */
import produce from 'immer';
import { showError } from 'utils/toast-utils';
import {
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_DATA,
} from './constants';
// The initial state of the App
export const initialState = {
  listEventTypes: [],
  listData: {
    rows: [],
    count: 0,
    totalPage: 0,
    loading: true,
  },
  listStatus: [],
  listZone: [],
  error: '',
  loading: true,
  isReloadData: false,
};
function mapingData(item) {
  return {
    ...item,
  };
}
const accessReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_DATA:
        draft.loading = true;
        break;
      case LOAD_DATA_SUCCESS:
        draft.listData = action.data.data;
        draft.loading = false;
        draft.isReloadData = false;
        draft.error = '';
        break;
      case LOAD_DATA_ERROR:
        showError(action.err);
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

export default accessReducer;
