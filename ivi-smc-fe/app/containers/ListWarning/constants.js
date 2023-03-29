/*
 *
 * ListWarning constants
 *
 */
// import { subDays } from 'date-fns';
import messages from './messages';
const scope = 'app/ListWarning';
export const DEFAULT_FILTER = {
  deviceType: null,
  type: null,
  status: null,
  area: null,
  fromDate: null,
  toDate: null,
};
export const DEVICE_TYPE = ['NVR', 'CAMERA'];
export const WARNING_STATUS = [
  { id: 'NEW', color: 'red', text: messages.status_NEW },
  {
    id: 'INPROGRESS',
    color: 'blue',
    text: messages.status_INPROGRESS,
  },
  {
    id: 'RESOLVED',
    color: 'green',
    text: messages.status_RESOLVED,
  },
  {
    id: 'CLOSED',
    color: 'amber',
    text: messages.status_CLOSED,
  },
];
export const DEFAULT_ACTION = `${scope}/DEFAULT_ACTION`;

export const SET_LOADING = `${scope}/SET_LOADING`;
export const SET_OPEN_DRAWER = `${scope}/SET_OPEN_DRAWER`;
export const SET_PAGE = `${scope}/SET_PAGE`;

export const LOAD_LIST_WARNING = `${scope}/LOAD_LIST_WARNING`;
export const LOAD_LIST_WARNING_SUCCESS = `${scope}/LOAD_LIST_WARNING_SUCCESS`;
export const LOAD_LIST_WARNING_ERROR = `${scope}/LOAD_LIST_WARNING_ERROR`;

export const INFO_WARNING = `${scope}/INFO_WARNING`;
export const INFO_WARNING_SUCCESS = `${scope}/INFO_WARNING_SUCCESS`;
export const INFO_WARNING_ERROR = `${scope}/INFO_WARNING_ERROR`;

export const EDIT_WARNING = `${scope}/EDIT_WARNING`;
export const EDIT_WARNING_SUCCESS = `${scope}/EDIT_WARNING_SUCCESS`;
export const EDIT_WARNING_ERROR = `${scope}/EDIT_WARNING_ERROR`;
