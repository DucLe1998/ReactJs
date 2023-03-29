/*
 *
 * Policy reducer
 *
 */
import produce from 'immer';
import {
  SHOW_LOADING,
  LOAD_POLICY_SUCCESS,
  LOAD_POLICY_FAIL,
  LOAD_POLICY_RESOURCE_SUCCESS,
  LOAD_DETAIL_SUCCESS,
  LOAD_MENU_ID_SUCCESS,
  EDIT_POLICY_SUCCESS,
  DELETE_POLICY_SUCCESS,
  ADD_NEW_SUCCESS,
  LOAD_ERROR,
} from './constants';

export const initialState = {
  listPolicy: { rows: [], count: 0 },
  listResource: [],
  listMenuDetail: [],
  error: '',
  loading: true,
  isLoading: false,
  needReload: 0,
  detailPolicy: {
    description: '',
    policyId: '',
    policyName: '',
    scopes: [],
    status: '',
  },
};
const policyReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_POLICY_SUCCESS:
        draft.listPolicy = action.data;
        draft.loading = false;
        break;
      case LOAD_POLICY_FAIL:
        // draft.listPolicy = { data: [], totalCount: 0 };
        draft.error = action.payload;
        draft.loading = false;
        break;
      case LOAD_DETAIL_SUCCESS:
        draft.detailPolicy = action.data;
        draft.loading = false;
        break;
      case LOAD_MENU_ID_SUCCESS:
        draft.listMenuDetail = action.data;
        draft.loading = false;
        break;
      case LOAD_POLICY_RESOURCE_SUCCESS:
        draft.listResource = action.data.data;
        draft.loading = false;
        break;
      case SHOW_LOADING:
        draft.loading = action.isLoading;
        break;
      case EDIT_POLICY_SUCCESS:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        break;
      case ADD_NEW_SUCCESS:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        break;
      case DELETE_POLICY_SUCCESS:
        draft.loading = false;
        draft.needReload = state.needReload + 1;
        break;
      case LOAD_ERROR:
        draft.loading = false;
        break;
      default:
        break;
    }
  });

export default policyReducer;
