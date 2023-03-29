import produce from 'immer';
import {
  LOADING,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SET_FORM_TYPE,
  LOAD_BROADCAST_ERROR,
  LOAD_BROADCAST_SUCCESS,
} from './constants';
import { getErrorMessage } from '../Common/function';

export const initialState = {
  loading: false,
  error: '',
  data: {},
  broadcastId: '',
};

const IntrusionCameraAiReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOADING:
        draft.loading = action.data;
        break;
      case LOAD_DATA_SUCCESS:
        draft.data = action.data;
        draft.loading = false;
        break;
      case LOAD_DATA_ERROR:
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      case SET_FORM_TYPE:
        draft.form = action.data;
        break;
      case LOAD_BROADCAST_SUCCESS:
        draft.broadcastId = action.data;
        draft.loading = false;
        break;
      case LOAD_BROADCAST_ERROR:
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      default:
        draft.loading = false;
        break;
    }
  });
export default IntrusionCameraAiReducer;
