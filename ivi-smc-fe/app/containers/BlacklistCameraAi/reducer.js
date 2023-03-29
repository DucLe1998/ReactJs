/*
 *
 * BlacklistCameraAi reducer
 *
 */
import produce from 'immer';
import {
  ADD_BLACKLIST_ERROR,
  ADD_BLACKLIST_SUCCESS,
  DEFAULT_ACTION,
  DELETE_USER_ERROR,
  DELETE_USER_SUCCESS,
  DOWNLOAD_BLACKLIST_ERROR,
  DOWNLOAD_BLACKLIST_SUCCESS,
  FORM_TYPE,
  LOAD_BLACKLIST_ERROR,
  LOAD_BLACKLIST_SUCCESS,
  LOAD_MOVEMENT_DETECTED_HISTORY_ERROR,
  LOAD_MOVEMENT_DETECTED_HISTORY_SUCCESS,
  LOAD_RELATED_IMAGE_ERROR,
  LOAD_RELATED_IMAGE_SUCCESS,
  SET_FORM,
  SET_LOADING,
  SET_OPEN_MOVEMENT_DETECTED_HISTORY_POPUP,
  UPDATE_NAME_ERROR,
  UPDATE_NAME_SUCCESS,
} from './constants';
import { showError } from '../../utils/toast-utils';
import { getErrorMessage } from '../Common/function';

export const initialState = {
  loading: false,
  error: null,
  needReload: 0,
  blackList: { rows: [], limit: 0, totalPage: 0, count: 0, page: 1 },
  movementDetected: {
    data: [],
    selectedUser: null,
  },
  openMovementDetectedPopup: false,
  relatedImage: [],
  form: FORM_TYPE.LIST,
};

/* eslint-disable default-case, no-param-reassign */
const blacklistCameraAiReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_LOADING:
        draft.loading = true;
        break;
      case LOAD_BLACKLIST_SUCCESS:
        draft.loading = false;
        draft.blackList = action.data;
        break;
      case LOAD_BLACKLIST_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case UPDATE_NAME_SUCCESS:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        break;
      case UPDATE_NAME_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case DELETE_USER_SUCCESS:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        break;
      case DELETE_USER_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case SET_OPEN_MOVEMENT_DETECTED_HISTORY_POPUP:
        draft.openMovementDetectedPopup = action.status;
        break;
      case LOAD_MOVEMENT_DETECTED_HISTORY_SUCCESS:
        draft.loading = false;
        draft.movementDetected = action.data;
        draft.openMovementDetectedPopup = true;
        break;
      case LOAD_MOVEMENT_DETECTED_HISTORY_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case LOAD_RELATED_IMAGE_SUCCESS:
        draft.loading = false;
        draft.relatedImage = action.data;
        break;
      case LOAD_RELATED_IMAGE_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case ADD_BLACKLIST_SUCCESS:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        draft.relatedImage = [];
        draft.form = FORM_TYPE.LIST;
        break;
      case ADD_BLACKLIST_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case SET_FORM:
        draft.loading = false;
        draft.form = action.form;
        break;
      case DOWNLOAD_BLACKLIST_SUCCESS:
        draft.loading = false;
        break;
      case DOWNLOAD_BLACKLIST_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      default:
        draft.loading = false;
        break;
    }
  });

export default blacklistCameraAiReducer;
