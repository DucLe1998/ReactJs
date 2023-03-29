/*
 *
 * Library constants
 *
 */
// import { subDays } from 'date-fns';
export const DEFAULT_FILTER = {
  type: null,
  fromDate: null,
  toDate: null,
};
export const FILE_TYPE = [
  {
    id: 'png',
    name: 'Ảnh',
  },
  {
    id: 'webm',
    name: 'Video',
  },
];
export const VIEW_TYPE = [
  {
    id: 1,
    name: 'List',
    icon: 'menu',
  },
  {
    id: 2,
    name: 'Grid',
    icon: 'mediumiconslayout',
  },
];
const scope = 'app/Library';
export const DEFAULT_ACTION = `${scope}/DEFAULT_ACTION`;
export const SET_LOADING = `${scope}/SET_LOADING`;
export const SET_PAGE = `${scope}/SET_PAGE`;

export const LOAD_LIST_FILE = `${scope}/LOAD_LIST_FILE`;
export const LOAD_LIST_FILE_SUCCESS = `${scope}/LOAD_LIST_FILE_SUCCESS`;
export const LOAD_LIST_FILE_ERROR = `${scope}/LOAD_LIST_FILE_ERROR`;

export const DELETE_FILE = `${scope}/DELETE_FILE`;
export const DELETE_FILE_SUCCESS = `${scope}/DELETE_FILE_SUCCESS`;
export const DELETE_FILE_ERROR = `${scope}/DELETE_FILE_ERROR`;

export const DOWNLOAD_FILE = `${scope}/DOWNLOAD_FILE`;
export const DOWNLOAD_FILE_SUCCESS = `${scope}/DOWNLOAD_FILE_SUCCESS`;
export const DOWNLOAD_FILE_ERROR = `${scope}/DOWNLOAD_FILE_ERROR`;
