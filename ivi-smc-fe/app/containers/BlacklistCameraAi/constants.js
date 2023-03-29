/*
 *
 * BlacklistCameraAi constants
 *
 */
export const getIconClass = name => {
  let icon = 'file';
  if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(name)) {
    icon = 'image';
  } else if (
    /\.(mp4|mkv|wmv|m4v|mov|avi|flv|webm|flac|mka|m4a|aac|ogg)$/i.test(name)
  ) {
    icon = 'video';
  }
  return `dx-icon-${icon}`;
};

export const FORM_TYPE = {
  LIST: 'LIST_BLACK_LIST',
  ADD: 'ADD_USER_TO_BLACKLIST',
};

export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.gif', '.png'];

export const DEFAULT_ACTION = 'app/BlacklistCameraAi/DEFAULT_ACTION';

export const SET_LOADING = 'app/BlacklistCameraAi/SET_LOADING';

export const LOAD_BLACKLIST = 'app/BlacklistCameraAi/LOAD_BLACKLIST';
export const LOAD_BLACKLIST_SUCCESS =
  'app/BlacklistCameraAi/LOAD_LIST_FILE_SUCCESS';
export const LOAD_BLACKLIST_ERROR =
  'app/BlacklistCameraAi/LOAD_LIST_FILE_ERROR';

export const SET_OPEN_MOVEMENT_DETECTED_HISTORY_POPUP =
  'app/BlacklistCameraAi/SET_OPEN_MOVEMENT_DETECTED_HISTORY_POPUP';
export const LOAD_MOVEMENT_DETECTED_HISTORY_SUCCESS =
  'app/BlacklistCameraAi/LOAD_MOVEMENT_DETECTED_HISTORY_SUCCESS';
export const LOAD_MOVEMENT_DETECTED_HISTORY_ERROR =
  'app/BlacklistCameraAi/LOAD_MOVEMENT_DETECTED_HISTORY_ERROR';
export const LOAD_MOVEMENT_DETECTED_HISTORY =
  'app/BlacklistCameraAi/LOAD_MOVEMENT_DETECTED_HISTORY';

export const UPDATE_NAME = 'app/BlacklistCameraAi/UPDATE_NAME';
export const UPDATE_NAME_SUCCESS = 'app/BlacklistCameraAi/UPDATE_NAME_SUCCESS';
export const UPDATE_NAME_ERROR = 'app/BlacklistCameraAi/UPDATE_NAME_ERROR';

export const DELETE_USER = 'app/BlacklistCameraAi/DELETE_USER';
export const DELETE_USER_SUCCESS = 'app/BlacklistCameraAi/DELETE_USER_SUCCESS';
export const DELETE_USER_ERROR = 'app/BlacklistCameraAi/DELETE_USER_ERROR';

export const LOAD_RELATED_IMAGE = 'app/BlacklistCameraAi/LOAD_RELATED_IMAGE';
export const LOAD_RELATED_IMAGE_SUCCESS =
  'app/BlacklistCameraAi/LOAD_RELATED_IMAGE_SUCCESS';
export const LOAD_RELATED_IMAGE_ERROR =
  'app/BlacklistCameraAi/LOAD_RELATED_IMAGE_ERROR';

export const ADD_BLACKLIST = 'app/BlacklistCameraAi/ADD_BLACKLIST';
export const ADD_BLACKLIST_SUCCESS =
  'app/BlacklistCameraAi/ADD_BLACKLIST_SUCCESS';
export const ADD_BLACKLIST_ERROR = 'app/BlacklistCameraAi/ADD_BLACKLIST_ERROR';

export const DOWNLOAD_BLACKLIST = 'app/BlacklistCameraAi/DOWNLOAD_BLACKLIST';
export const DOWNLOAD_BLACKLIST_SUCCESS =
  'app/BlacklistCameraAi/DOWNLOAD_BLACKLIST_SUCCESS';
export const DOWNLOAD_BLACKLIST_ERROR =
  'app/BlacklistCameraAi/DOWNLOAD_BLACKLIST_ERROR';

export const SET_FORM = 'app/BlacklistCameraAi/SET_FORM';
