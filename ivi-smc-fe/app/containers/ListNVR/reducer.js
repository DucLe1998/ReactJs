/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  LOAD_NVR_DETAIL_ERROR,
  LOAD_NVR_DETAIL_SUCCESS,
  LOAD_NVR_CAMERAS_ERROR,
  LOAD_NVR_CAMERAS_SUCCESS,
  LOAD_DATA,
  CHANGE_PASSWORD,
  UPDATE_ROW,
  CHANGE_PASSWORD_SUCCESS,
  UPDATE_ROW_SUCCESS,
  ADD_NEW_SUCCESS,
  DELETE_ROWS_SUCCESS,
  IMPORT_FILE_SUCCESS,
  LOAD_NVR_DETAIL,
} from './constants';
import { getErrorMessage } from '../Common/function';
// The initial state of the App
export const initialState = {
  listEventTypes: [],
  editingItem: {
    id: '',
    name: '',
    ip: '',
    port: '',
    serial: '',
    areaName: '',
    available: 0,
    status: '',
    statusCode: '',
    version: '',
    children: [],
    information: {
      username: '',
    },
    listCamera: [],
    // listCamera: {
    //   rows: [
    //     // {
    //     //   id: '0',
    //     //   name: 'Camera 01',
    //     //   type: 'Camera an ninh',
    //     //   areaName: 'Ban Quản lý',
    //     //   status: 'Offline',
    //     //   statusCode: 'OFFLINE',
    //     // },
    //     // {
    //     //   id: '0',
    //     //   name: 'Camera 02',
    //     //   type: 'Camera giao thông',
    //     //   areaName: 'Ban Quản lý',
    //     //   status: 'Online',
    //     //   statusCode: 'ONLINE',
    //     // },
    //   ],
    //   totalCount: 0,
    //   totalPage: 0,
    //   loading: true,
    // },
  },
  listData: {
    reloadData: true,
    data: [
      // {
      //   id: '0',
      //   name: 'NVR 01',
      //   ip: '192.168.0.1',
      //   port: '8000',
      //   serial: 'ABC#AS',
      //   areaName: 'Ban Quản lý',
      //   available: 10,
      //   status: 'offline',
      //   statusCode: 'OFFLINE',
      //   version: '1.0.1',
      //   username: 'admin',
      // },
      // {
      //   id: '1',
      //   name: 'NVR 02',
      //   ip: '192.168.0.2',
      //   port: '8001',
      //   serial: 'ABC#AS2',
      //   areaName: 'Tầng 1 - Phòng 103',
      //   available: 10,
      //   status: 'online',
      //   statusCode: 'ONLINE',
      //   version: '1.0.1',
      //   username: 'admin',
      // },
    ],
    totalRow: 0,
    totalPage: 0,
    loading: true,
  },
  listStatus: [],
  listZone: [],
  error: '',
  message: '',
  loading: true,
  isOpenPopupConfirmEvent: false,
  isOpenPopupResultEvent: false,
};
function mapingData(item) {
  return {
    ...item,
    ...{
      available: item.children ? item.children.length : 0,
    },
    // id: item.id,
    // name: item.name,
    // ip: item.information.ip,
    // port: item.information.port,
    // serial: item.information.serial,
    // version: item.information.version,
    // username: item.information.username,
    // areaName: item.areaEntity.name,
    // available: item.children.length,
    // status: item.status,
    // statusCode: item.status,
  };
}
const loginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_DATA:
      case CHANGE_PASSWORD:
      case UPDATE_ROW:
        draft.loading = true;
        break;
      case LOAD_DATA_SUCCESS:
        draft.listData = { ...draft.listData, ...action.data.data };
        draft.listData.data = draft.listData.data.map(item => mapingData(item));
        draft.loading = false;
        // draft.isReloadData = false;
        draft.error = '';
        break;
      case LOAD_NVR_DETAIL_SUCCESS:
        draft.editingItem = mapingData(action.data.data);
        break;
      case LOAD_NVR_CAMERAS_SUCCESS:
        draft.editingItem.listCamera = action.data.data;
        break;
      case LOAD_DATA_ERROR:
      case LOAD_NVR_DETAIL_ERROR:
      case LOAD_NVR_CAMERAS_ERROR:
        draft.listData = initialState.listData;
        draft.editingItem = initialState.editingItem;
        draft.error = getErrorMessage(action.err);
        draft.loading = false;
        break;
      case CHANGE_PASSWORD_SUCCESS:
        draft.loading = false;
        break;
      case ADD_NEW_SUCCESS:
      case DELETE_ROWS_SUCCESS:
      case IMPORT_FILE_SUCCESS:
        draft.loading = false;
        draft.listData.reloadData = !draft.listData.reloadData;
        break;
      case UPDATE_ROW_SUCCESS:
        draft.loading = false;
        draft.editingItem = { ...draft.editingItem, ...action.data.data };
        break;
      case LOAD_NVR_DETAIL:
        draft.editingItem = initialState.editingItem;
        break;
      case SHOW_LOADING:
        draft.loading = action.isLoading;
        break;
      default:
        break;
      // draft.loading = true;
    }
  });

export default loginReducer;
