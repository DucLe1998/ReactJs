/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  ADD_CAMERA_TO_PLAYBACK_SUCCESS,
  CHANGE_FIELD,
  LOAD_DATA_PLAYBACK_SUCCESS,
} from './constants';
import { getErrorMessage } from '../Common/function';
// The initial state of the App
export const initialState = {
  data: [],
  dataPlayback: '',
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
      case ADD_CAMERA_TO_PLAYBACK_SUCCESS:
        draft.loading = false;
        draft.isReloading = true;
        break;
      case LOAD_DATA_SUCCESS:
        draft.data = action.data;
        draft.loading = false;
        draft.error = '';
        draft.isReloading = false;
        break;
      case LOAD_DATA_PLAYBACK_SUCCESS:
        draft.dataPlayback = action.data;
        draft.loading = false;
        draft.error = '';
        draft.isReloading = false;
        break;
      case LOAD_DATA_ERROR:
        draft.data = { data: [], totalCount: 0 };
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
