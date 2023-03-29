/*
 *
 * AcConfigDoor constants
 *
 */

export const STATUS_FILTER_DOOR = [
  { value: null, label: 'Tất cả' },
  { value: 'CONNECTED', label: 'Đang hoạt động' },
  { value: 'OPENING', label: 'Đang mở' },
  { value: 'DISCONNECTED', label: 'Mất kết nối' },
  { value: 'CLOSING', label: 'Đang đóng' },
  { value: 'UNASSIGN', label: 'Chưa gắn thiết bị' },
  { value: 'LOCKED', label: 'Đang khóa' },
];

const scope = 'app/AcConfigDoor';
export const DEFAULT_ACTION = 'app/AcConfigDoor/DEFAULT_ACTION';
export const DEFAULT_FILTER = {
  doorGroup: [],
  area: null,
  status: null,
};
export const SET_LOADING = `${scope}/SET_LOADING`;
export const SET_OPEN_DRAWER = `${scope}/SET_OPEN_DRAWER`;
export const SET_PAGE = `${scope}/SET_PAGE`;

export const LOAD_LIST_DOOR = `${scope}/LOAD_LIST_DOOR`;
export const LOAD_LIST_DOOR_SUCCESS = `${scope}/LOAD_LIST_DOOR_SUCCESS`;
export const LOAD_LIST_DOOR_ERROR = `${scope}/LOAD_LIST_DOOR_ERROR`;

export const INFO_DOOR = `${scope}/INFO_DOOR`;
export const INFO_DOOR_SUCCESS = `${scope}/INFO_DOOR_SUCCESS`;
export const INFO_DOOR_ERROR = `${scope}/INFO_DOOR_ERROR`;

export const ADD_DOOR = `${scope}/ADD_DOOR`;
export const ADD_DOOR_SUCCESS = `${scope}/ADD_DOOR_SUCCESS`;
export const ADD_DOOR_ERROR = `${scope}/ADD_DOOR_ERROR`;

export const EDIT_DOOR = `${scope}/EDIT_DOOR`;
export const EDIT_DOOR_SUCCESS = `${scope}/EDIT_DOOR_SUCCESS`;
export const EDIT_DOOR_ERROR = `${scope}/EDIT_DOOR_ERROR`;

export const DELETE_DOOR = `${scope}/DELETE_DOOR`;
export const DELETE_DOOR_SUCCESS = `${scope}/DELETE_DOOR_SUCCESS`;
export const DELETE_DOOR_ERROR = `${scope}/DELETE_DOOR_ERROR`;
