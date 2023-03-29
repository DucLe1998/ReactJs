import produce from 'immer';
import {
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_LIST_PARENT_MENU_SUCCESS,
  LOAD_LIST_PARENT_MENU_ERROR,
  CLEAR_ERROR,
} from './constants';
import { getErrorMessage } from '../Common/function';
// The initial state of the App
export const initialState = {
  listParentMenu: [],
  listMenu: { data: [], totalCount: 0, loading: true },
  error: '',
  loading: true,
};

const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_DATA_SUCCESS:
        draft.listMenu = action.data;
        draft.loading = false;
        draft.error = '';
        break;
      case LOAD_DATA_ERROR:
        draft.listMenu = { data: [], totalCount: 0 };
        draft.error = getErrorMessage(action.err);
        draft.loading = false;
        break;
      case LOAD_LIST_PARENT_MENU_SUCCESS:
        draft.listParentMenu = action.data;
        break;
      case LOAD_LIST_PARENT_MENU_ERROR:
        draft.error = getErrorMessage(action.err);
        break;
      case SHOW_LOADING:
        draft.loading = action.isLoading;
        break;
      case CLEAR_ERROR:
        draft.error = '';
        break;
      default:
        break;
    }
  });

export default loginReducer;
