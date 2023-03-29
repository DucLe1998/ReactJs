/*
 *
 * DetailBackListUser reducer
 *
 */
import produce from 'immer';
import {
  CLEAR_STATE,
  DEFAULT_ACTION,
  FORM_TYPE,
  LOAD_BLOCK_ERROR,
  LOAD_BLOCK_SUCCESS,
  LOAD_DETAIL_EVENT_ERROR,
  LOAD_DETAIL_EVENT_SUCCESS,
  LOAD_FLOOR_ERROR,
  LOAD_FLOOR_SUCCESS,
  LOAD_LIST_DEVICE_ERROR,
  LOAD_LIST_DEVICE_SUCCESS,
  LOAD_MOVEMENT_HISTORY_ERROR,
  LOAD_MOVEMENT_HISTORY_SUCCESS,
  SET_FORM_TYPE,
  SET_LOADING,
  SET_OPEN_DRAWER,
  UPDATE_DESCRIPTION_ERROR,
  UPDATE_DESCRIPTION_SUCCESS,
} from './constants';
import { showError } from '../../utils/toast-utils';
import { getErrorMessage } from '../Common/function';

export const initialState = {
  loading: false,
  error: null,
  openDetailsDrawer: false,
  needReload: 0,
  blocks: [],
  floors: [],
  mapFloor: null,
  devices: [],
  movementHistory: [],
  detailEvent: {},
  form: FORM_TYPE.DETAIL,
};

/* eslint-disable default-case, no-param-reassign */
const detailBackListUserReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case CLEAR_STATE:
        Object.entries(initialState).forEach(([k, v]) => {
          draft[k] = v;
        });
        break;
      case SET_LOADING:
        draft.loading = action.data;
        break;
      case SET_OPEN_DRAWER:
        draft.openDetailsDrawer = action.data;
        break;
      case SET_FORM_TYPE:
        draft.form = action.data;
        break;
      case LOAD_BLOCK_SUCCESS:
        draft.loading = false;
        draft.blocks = action.data;
        break;
      case LOAD_BLOCK_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case LOAD_FLOOR_SUCCESS:
        draft.loading = false;
        draft.floors = action.data;
        break;
      case LOAD_FLOOR_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case LOAD_LIST_DEVICE_SUCCESS:
        draft.loading = false;
        draft.devices = action.data.data;
        draft.mapFloor = action.data.map;
        break;
      case LOAD_LIST_DEVICE_ERROR:
        draft.loading = false;
        draft.devices = [];
        draft.mapFloor = null;
        showError(getErrorMessage(action.error));
        break;
      case LOAD_DETAIL_EVENT_SUCCESS:
        draft.loading = false;
        draft.detailEvent = action.data;
        break;
      case LOAD_DETAIL_EVENT_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case LOAD_MOVEMENT_HISTORY_SUCCESS:
        draft.openDetailsDrawer = true;
        draft.loading = false;
        draft.movementHistory = action.data;
        break;
      case LOAD_MOVEMENT_HISTORY_ERROR:
        draft.loading = false;
        showError(getErrorMessage(action.error));
        break;
      case UPDATE_DESCRIPTION_SUCCESS:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        break;
      case UPDATE_DESCRIPTION_ERROR:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        showError(getErrorMessage(action.error));
        break;
      default:
        draft.loading = false;
        break;
    }
  });

export default detailBackListUserReducer;
