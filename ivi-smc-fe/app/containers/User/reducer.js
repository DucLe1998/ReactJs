import produce from 'immer';
import {
  SHOW_LOADING,
  LOAD_DATA_ERROR,
  LOAD_DATA_SUCCESS,
  LOAD_ERROR,
  LOAD_UNIT_SUCCESS,
  LOAD_POSITION_SUCCESS,
  LOAD_AUTHORITY_SUCCESS,
  LOAD_USER_SUCCESS,
  ADD_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  UPDATE_STATUS_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  LOAD_DON_VI_KIEM_NHIEM_SUCCESS,
  UPDATE_DVKN_SUCCESS,
  DELETE_DVKN_SUCCESS,
  ADD_DVKN_SUCCESS,
  DELETE_ROLE_SUCCESS,
} from './constants';
import { getErrorMessage } from '../Common/function';
import { showError, showSuccess } from '../../utils/toast-utils';

export const initialState = {
  loading: true,
  users: [],
  user: {},
  error: '',
  authorities: [],
  units: [],
  positions: [],
  DVKN: [],
};

const userReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SHOW_LOADING:
        draft.loading = action.isLoading;
        break;
      case LOAD_DATA_SUCCESS:
        draft.loading = false;
        draft.error = '';
        draft.users = action.data;
        break;
      case LOAD_DATA_ERROR:
        draft.loading = false;
        draft.users = { data: [], totalCount: 0 };
        draft.error = getErrorMessage(action.err);
        break;
      case LOAD_UNIT_SUCCESS:
        draft.loading = false;
        draft.units = action.data;
        break;
      case LOAD_POSITION_SUCCESS:
        draft.loading = false;
        draft.positions = action.data;
        break;
      case LOAD_AUTHORITY_SUCCESS:
        draft.loading = false;
        draft.authorities = action.data;
        break;
      case LOAD_USER_SUCCESS:
        draft.loading = false;
        draft.user = action.data;
        break;
      case ADD_USER_SUCCESS:
        draft.loading = false;
        break;
      case UPDATE_USER_SUCCESS:
        draft.loading = false;
        showSuccess('Cập nhật người dùng thành công');
        break;
      case DELETE_USER_SUCCESS:
        draft.loading = false;
        break;
      case UPDATE_STATUS_USER_SUCCESS:
        draft.loading = false;
        showSuccess('Thay đổi trạng thái người dùng thành công');
        break;
      case LOAD_DON_VI_KIEM_NHIEM_SUCCESS:
        draft.loading = false;
        draft.DVKN = action.data;
        break;
      case UPDATE_DVKN_SUCCESS:
        draft.loading = false;
        showSuccess('Cập nhật đơn vị kiêm nhiệm thành công');
        break;
      case ADD_DVKN_SUCCESS:
        draft.loading = false;
        showSuccess('Tạo mới đơn vị kiêm nhiệm thành công');
        break;
      case DELETE_DVKN_SUCCESS:
        draft.loading = false;
        showSuccess('Xóa đơn vị kiêm nhiệm thành công');
        break;
      case DELETE_ROLE_SUCCESS:
        draft.loading = false;
        showSuccess('Xóa vai trò thành công');
        break;
      case LOAD_ERROR:
        draft.loading = false;
        if (action.key === 'units') {
          draft.units = [];
        } else if (action.key === 'positions') {
          draft.positions = [];
        } else if (action.key === 'authorities') {
          draft.authorities = [];
        } else if (action.key === 'user') {
          draft.user = {};
          window.location.assign(`/user`);
        } else if (action.key === 'DVKN') {
          draft.DVKN = [];
        } else {
          draft.error = getErrorMessage(action.err);
        }
        break;
      default:
        draft.loading = false;
        break;
    }
  });

export default userReducer;
