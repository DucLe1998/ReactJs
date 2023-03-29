/*
 *
 * Profile reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  LOAD_PROFILE,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_ERROR,
  CHANGE_PASSWORD_PROFILE,
  CHANGE_PASSWORD_PROFILE_SUCCESS,
  CHANGE_PASSWORD_PROFILE_ERROR,
} from './constants';
import { showError } from '../../utils/toast-utils';

export const initialState = {
  loading: false,
  profile: [],
  error: [],
};

/* eslint-disable default-case, no-param-reassign */
const profileReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        draft.loading = true;
        break;
      case LOAD_PROFILE:
        draft.loading = true;
        break;
      case LOAD_PROFILE_SUCCESS:
        draft.loading = false;
        draft.profile = action.data;
        draft.error = [];
        break;
      case LOAD_PROFILE_ERROR:
        draft.loading = false;
        draft.profile = [];
        draft.error = action.error;
        showError(action.err);
        break;
      case CHANGE_PASSWORD_PROFILE:
        draft.loading = true;
        break;
      case CHANGE_PASSWORD_PROFILE_SUCCESS:
        draft.loading = false;
        break;
      case CHANGE_PASSWORD_PROFILE_ERROR:
        draft.loading = false;
        showError(action.err);
        break;
      default:
        break;
    }
  });

export default profileReducer;
