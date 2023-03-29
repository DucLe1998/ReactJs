/* eslint-disable no-case-declarations */
import produce from 'immer';
import {
  CHANGE_SIDE_MENU_STATE,
  LOAD_MENU_SUCCESS,
  LOAD_MENU_ERROR,
  LOAD_USER_ATHORITY_ERROR,
  LOAD_USER_ATHORITY_SUCCESS,
  CHANGE_EXPAND_MENU,
  CHANGE_SELECTED_ITEMS,
  CHANGE_EXPANDED_ITEM,
  UNLOAD_MENU,
} from './constants';
import { getErrorMessage } from '../Common/function';
import {
  hashMenu,
  formatRawDataMenu,
  // formatDataFunctionPermission,
} from '../../utils/functions';
let checkMenuExpandState = window.localStorage.getItem('menuExpanded');
if (!checkMenuExpandState) {
  checkMenuExpandState = true;
  window.localStorage.setItem('menuExpanded', true);
}

// The initial state of the App
export const initialState = {
  sideMenuOpened: false,
  userMenus: [],
  userMenusRawData: [],
  userMenuHash: {},
  listUserAuthority: [],
  isDataLoaded: false,
  isAuthorityLoaded: 0,
  listAction: [],
  error: '',
  menuLoaded: 0,
  apiMessage: '',
  expanded: checkMenuExpandState,
};

const menuReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CHANGE_SIDE_MENU_STATE:
        draft.sideMenuOpened = action.isOpened;
        break;
      case LOAD_MENU_SUCCESS:
        draft.menuLoaded = state.menuLoaded + 1;
        // const data = action.response.concat(...fakeData);
        const data = action.response;
        draft.userMenusRawData = data;
        const hash = hashMenu(data);
        draft.userMenuHash = hash;
        draft.userMenus = formatRawDataMenu(data, hash);
        draft.isDataLoaded = true;
        break;
      case LOAD_MENU_ERROR:
        draft.error = getErrorMessage(action.error);
        break;
      case LOAD_USER_ATHORITY_SUCCESS:
        const dataMap = action.response.reduce(
          (total, cur) => ({
            ...total,
            [cur.resourceCode]: (total[cur.resourceCode] || []).concat(
              cur.scope,
            ),
          }),
          {},
        );
        Object.keys(dataMap).forEach((k) => {
          dataMap[k] = dataMap[k].reduce((t, c) => ({ ...t, [c]: true }), {});
        });
        draft.listUserAuthority = dataMap;
        draft.isAuthorityLoaded = state.isAuthorityLoaded + 1;
        break;
      case LOAD_USER_ATHORITY_ERROR:
        draft.error = getErrorMessage(action.error);
        break;
      case CHANGE_EXPAND_MENU:
        draft.expanded = action.expanded;
        break;
      case CHANGE_SELECTED_ITEMS:
        const hashD = hashMenu(state.userMenusRawData);
        let currentItem = hashD[action.item.id];
        if (currentItem) {
          let isParent = false;
          while (currentItem) {
            currentItem.selected = true;
            if (isParent) currentItem.expanded = true;
            currentItem = hashD[currentItem.parentId];
            isParent = true;
          }
          draft.userMenuHash = hashD;
          draft.userMenus = formatRawDataMenu(state.userMenusRawData, hashD);
        }
        break;
      case CHANGE_EXPANDED_ITEM:
        const expandedItem = draft.userMenuHash[action.item.id];
        if (expandedItem) {
          expandedItem.expanded = !expandedItem.expanded;
          draft.userMenus = formatRawDataMenu(
            state.userMenusRawData,
            draft.userMenuHash,
          );
        }
        break;
      case UNLOAD_MENU:
        draft.menuLoaded = 0;
        draft.isAuthorityLoaded = 0;
        break;
      default:
        break;
    }
  });
export default menuReducer;
