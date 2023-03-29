/*
 *
 * ListCamera constants
 *
 */
export const DEFAULT_FILTER = {
  statusOfDevice: null,
  parent: null,
  area: null,
};
export const LIST_STATUS = [
  { text: 'Online', id: 'ONLINE', color: 'green' },
  { text: 'Offline', id: 'OFFLINE', color: 'red' },
];
export const LIST_EVENTS = [
  { text: 'Tất cả', id: 'ALL' },
  { text: 'Nhận dạng mặt', id: 'HUMAN_FACE' },
  { text: 'Tìm đồ vật thất lạc', id: 'MISSING_ITEM' },
];
const scope = 'app/ListCamera';
export const DEFAULT_ACTION = `${scope}/DEFAULT_ACTION`;
export const SET_LOADING = `${scope}/SET_LOADING`;
export const SET_OPEN_DRAWER = `${scope}/SET_OPEN_DRAWER`;
export const SET_PAGE = `${scope}/SET_PAGE`;

export const LOAD_LIST_CAMERA = `${scope}/LOAD_LIST_CAMERA`;
export const LOAD_LIST_CAMERA_SUCCESS = `${scope}/LOAD_LIST_CAMERA_SUCCESS`;
export const LOAD_LIST_CAMERA_ERROR = `${scope}/LOAD_LIST_CAMERA_ERROR`;
