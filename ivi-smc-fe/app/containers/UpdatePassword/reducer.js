/*
 *
 * UpdatePassword reducer
 *
 */
import produce from 'immer';
import {
  LOADING,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_ERROR,
  CLEAR_ERROR,
} from './constants';
import { getErrorMessage } from '../Common/function';

export const initialState = {
  error: '',
  loading: false,
  apiMessage: '',
};

/* eslint-disable default-case, no-param-reassign */
const updatePasswordReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOADING:
        draft.loading = true;
        break;
      case UPDATE_PASSWORD:
        draft.loading = false;
        break;
      case UPDATE_PASSWORD_SUCCESS:
        draft.loading = false;
        draft.apiMessage = 'UPDATE_PASSWORD_SUCCESS';
        break;
      case UPDATE_PASSWORD_ERROR:
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      case CLEAR_ERROR:
        draft.error = '';
        break;
      default:
        draft.loading = false;
        break;
    }
  });

export default updatePasswordReducer;
