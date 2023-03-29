/*
 *
 * ListItemsCameraAi reducer
 *
 */
import produce from 'immer';
import {
  LOADING,
  LOAD_LIST_ITEMS_TYPE_SUCCESS,
  LOAD_LIST_ITEMS_TYPE_ERROR,
  LOAD_LIST_ITEMS_COLOR_SUCCESS,
  LOAD_LIST_ITEMS_COLOR_ERROR,
  LOAD_LIST_ITEMS_CAMERAAI_SUCCESS,
  LOAD_LIST_ITEMS_CAMERAAI_ERROR,
} from './constants';
import { getErrorMessage } from '../Common/function';

export const initialState = {
  loading: false,
  error: '',
  listType: [],
  listColor: [],
  listItemCameraAi: [],
  dataItems: {
    totalPage: 0,
    count: 0,
    rows: [],
  },
};

const listItemsCameraAiReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOADING:
        draft.loading = true;
        break;
      case LOAD_LIST_ITEMS_TYPE_SUCCESS:
        draft.listType = action.data;
        draft.loading = false;
        break;
      case LOAD_LIST_ITEMS_TYPE_ERROR:
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      case LOAD_LIST_ITEMS_COLOR_SUCCESS:
        draft.listColor = action.data;
        draft.loading = false;
        break;
      case LOAD_LIST_ITEMS_COLOR_ERROR:
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      case LOAD_LIST_ITEMS_CAMERAAI_SUCCESS:
        draft.dataItems = action.data;
        draft.loading = false;
        break;
      case LOAD_LIST_ITEMS_CAMERAAI_ERROR:
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      default:
        draft.loading = false;
        break;
    }
  });
export default listItemsCameraAiReducer;
