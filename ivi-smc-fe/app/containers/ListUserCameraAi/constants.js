/*
 *
 * ListUserCameraAi constants
 *
 */
export const ACTION = {
  PLAYBACK: 'PLAYBACK_FORM',
  LIVE: 'LIVE_FORM',
};
export const SEARCH = {
  DETECTED_EVENTS_BY_TEXT: 'DETECTED_EVENTS_BY_TEXT',
  USERS_BY_TEXT: 'USERS_BY_TEXT',
  BY_TEXT: 'SEARCH_TEXT',
  BY_IMAGE: 'SEARCH_IMAGE',
};

export const SUPPORTED_FILE_TYPE = [
  '.jpeg',
  '.gif',
  '.png',
  '.jpg',
  '.tiff',
  '.bmp',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const LOADING = 'app/ListUserCameraAi/LOADING';

export const LOAD_SEARCH_HISTORY = 'app/ListUserCameraAi/LOAD_SEARCH_HISTORY';
export const LOAD_SEARCH_HISTORY_SUCCESS =
  'app/ListUserCameraAi/LOAD_SEARCH_HISTORY_SUCCESS';
export const LOAD_SEARCH_HISTORY_ERROR =
  'app/ListUserCameraAi/LOAD_SEARCH_HISTORY_ERROR';

export const LOAD_AUTOCOMPLETE_SEARCH =
  'app/ListUserCameraAi/LOAD_AUTOCOMPLETE_SEARCH';
export const LOAD_AUTOCOMPLETE_SEARCH_SUCCESS =
  'app/ListUserCameraAi/LOAD_AUTOCOMPLETE_SEARCH_SUCCESS';
export const LOAD_AUTOCOMPLETE_SEARCH_ERROR =
  'app/ListUserCameraAi/LOAD_AUTOCOMPLETE_SEARCH_ERROR';

export const LOAD_USER_DETECTED_EVENT =
  'app/ListUserCameraAi/LOAD_USER_DETECTED_EVENT';
export const LOAD_USER_DETECTED_EVENT_SUCCESS =
  'app/ListUserCameraAi/LOAD_USER_DETECTED_EVENT_SUCCESS';
export const LOAD_USER_DETECTED_EVENT_ERROR =
  'app/ListUserCameraAi/LOAD_USER_DETECTED_EVENT_ERROR';

export const LOAD_USER_DETECTED_IMAGE =
  'app/ListUserCameraAi/LOAD_USER_DETECTED_IMAGE';
export const LOAD_USER_DETECTED_IMAGE_SUCCESS =
  'app/ListUserCameraAi/LOAD_USER_DETECTED_IMAGE_SUCCESS';
export const LOAD_USER_DETECTED_IMAGE_ERROR =
  'app/ListUserCameraAi/LOAD_USER_DETECTED_IMAGE_ERROR';

export const LOAD_FILE_IMAGE = 'app/ListUserCameraAi/LOAD_FILE_IMAGE';
export const CLEAR_FILE_IMAGE_SEARCH =
  'app/ListUserCameraAi/CLEAR_FILE_IMAGE_SEARCH';
