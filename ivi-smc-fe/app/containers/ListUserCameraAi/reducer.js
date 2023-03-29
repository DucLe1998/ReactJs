/*
 *
 * ListUserCameraAi reducer
 *
 */
import produce from 'immer';
import {
  CLEAR_FILE_IMAGE_SEARCH,
  LOAD_AUTOCOMPLETE_SEARCH_ERROR,
  LOAD_AUTOCOMPLETE_SEARCH_SUCCESS,
  LOAD_FILE_IMAGE,
  LOAD_SEARCH_HISTORY_ERROR,
  LOAD_SEARCH_HISTORY_SUCCESS,
  LOAD_USER_DETECTED_EVENT_ERROR,
  LOAD_USER_DETECTED_EVENT_SUCCESS,
  LOAD_USER_DETECTED_IMAGE,
  LOAD_USER_DETECTED_IMAGE_ERROR,
  LOAD_USER_DETECTED_IMAGE_SUCCESS,
  LOADING,
  SEARCH,
} from './constants';
import { getErrorMessage } from '../Common/function';

export const initialState = {
  loading: false,
  error: '',
  searchImageData: {
    fileImageUpload: null,
    fileImageSearch: null,
  },
  historySearch: { rows: [] },
  previewData: { rows: [] },
  searchByImageResult: {
    detectedEvents: {
      totalPage: 0,
      count: 0,
      rows: [],
    },
    relatedUsers: {
      rows: [],
    },
  },
  searchByTextResult: {
    detectedEvents: {
      totalPage: 0,
      count: 0,
      rows: [],
    },
    detectedUsers: {
      totalPage: 0,
      count: 0,
      rows: [],
    },
  },
  action: '',
};

/* eslint-disable default-case, no-param-reassign */
const listUserCameraAiReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOADING:
        draft.loading = true;
        break;
      case LOAD_SEARCH_HISTORY_SUCCESS:
        draft.loading = false;
        draft.historySearch.rows = action.data;
        draft.previewData.rows = action.data;
        break;
      case LOAD_SEARCH_HISTORY_ERROR:
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      case LOAD_AUTOCOMPLETE_SEARCH_SUCCESS:
        draft.loading = false;
        draft.previewData.rows = action.data.rows;
        break;
      case LOAD_AUTOCOMPLETE_SEARCH_ERROR:
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      case LOAD_USER_DETECTED_EVENT_SUCCESS:
        draft.loading = false;
        draft.action = SEARCH.BY_TEXT;
        draft.searchByTextResult = action.data;
        draft.searchByImageResult = initialState.searchByImageResult;
        break;
      case LOAD_USER_DETECTED_EVENT_ERROR:
        draft.searchByTextResult = initialState.searchByTextResult;
        draft.searchByImageResult = initialState.searchByImageResult;
        draft.loading = false;
        draft.error = getErrorMessage(action.error);
        break;
      case LOAD_FILE_IMAGE:
        draft.searchImageData.fileImageUpload = action.file;
        break;
      case CLEAR_FILE_IMAGE_SEARCH:
        draft.searchImageData.fileImageSearch = action.file;
        break;
      case LOAD_USER_DETECTED_IMAGE:
        draft.loading = false;
        draft.searchImageData.fileImageSearch = action.file;
        break;
      case LOAD_USER_DETECTED_IMAGE_SUCCESS:
        draft.loading = false;
        draft.action = SEARCH.BY_IMAGE;
        draft.searchByImageResult = action.data;
        draft.searchByTextResult = initialState.searchByTextResult;
        break;
      case LOAD_USER_DETECTED_IMAGE_ERROR:
        draft.loading = false;
        draft.action = SEARCH.BY_IMAGE;
        draft.searchByTextResult = initialState.searchByTextResult;
        draft.searchByImageResult = initialState.searchByImageResult;
        draft.error = getErrorMessage(action.error);
        break;
      default:
        draft.loading = false;
        break;
    }
  });

export default listUserCameraAiReducer;
