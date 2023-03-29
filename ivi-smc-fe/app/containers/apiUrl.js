const {
  AREA_ID,
  SAP_SRC,
  IAM_API_SRC,
  DEVICE_API_SRC,
  CMS_API_SRC,
  ACCESS_CONTROL_API_SRC,
  STORAGE_SRC,
  CAMERA_AI_API_SRC,
  GUEST_REGISTRATION,
  PARKING_API_SRC,
  ARTICLES_SRC,
  NOTIFICATION_EVENT_API_SRC,
  FIRE_ALARM,
  NAVIGATION,
  API_HOST,
  INTERCOM_SRC,
} = process.env;

export {
  ACCESS_CONTROL_API_SRC,
  IAM_API_SRC,
  GUEST_REGISTRATION,
  SAP_SRC,
  STORAGE_SRC,
  FIRE_ALARM,
  NOTIFICATION_EVENT_API_SRC,
  PARKING_API_SRC,
  ARTICLES_SRC,
  CAMERA_AI_API_SRC,
  NAVIGATION,
  API_HOST,
  INTERCOM_SRC,
};

export const SAP_API = {
  LIST_AREA: `${SAP_SRC}/area/get-list-area`,
  ROOT_AREA: `${SAP_SRC}/area`,
  CHILD_AREA: (id) => `${SAP_SRC}/area/${id}/child`,
  DETAIL_AREA: (id) => `${SAP_SRC}/area/${id}`,
};
export const NAVIGATION_API = {
  TYPE_OF_CAR: `${NAVIGATION}/type-of-car/gets`,
  POINTS: `${NAVIGATION}/points/gets`,
  ALLOWED_POINTS: (id) => `${NAVIGATION}/type-of-car/${id}/allowed-points`,
  DISALLOWED_POINTS: (id) =>
    `${NAVIGATION}/type-of-car/${id}/disallowed-points`,
  GET_MAP: `${NAVIGATION}/maps/info`,
  LIST_ROUTE: `${NAVIGATION}/routes/tracking`,
  DETAILS_ROUTE: (id) => `${NAVIGATION}/routes/${id}`,
};
export const API_IAM = {
  LOGIN_API: {
    LOCAL: `${IAM_API_SRC}/login-with-local`,
    AD: `${IAM_API_SRC}/login-with-ldap`,
  },
  LOGOUT_API: `${IAM_API_SRC}/me/logout`,
  FORGOT_PASSWORD_API: `${IAM_API_SRC}/me/forgot-password`,
  CONFIRM_FORGOT_PASSWORD_API: `${IAM_API_SRC}/me/confirm-forgot-password`,
  CHANGE_TMP_PASSWORD: `${IAM_API_SRC}/users/update-password`,
  REFRESH_TOKEN_API: `${IAM_API_SRC}/refresh-token`,
  USER_LIST: `${IAM_API_SRC}/users/search`,
  USER_EXTRA_KEYS: `${IAM_API_SRC}/users/extra-menu/gets?status=ACTIVE`,
  USER_DETAIL: (id) => `${IAM_API_SRC}/users/${id}/detail`,
  USER_DOWNLOAD_TEMPLATE: `${IAM_API_SRC}/users/download/template`,
  USER_DOWNLOAD: `${IAM_API_SRC}/users/download`,
  USER_UPLOAD: `${IAM_API_SRC}/users/upload-user`,
  USER: `${IAM_API_SRC}/users`,
  USER_DETAIL_BY_ID: `${IAM_API_SRC}/users/@userId/detail`,
  DELETE_USER: `${IAM_API_SRC}/users/@username`,
  USER_ENABLE: (userId, enabled) =>
    `${IAM_API_SRC}/users/${userId}/enable?enabled=${enabled}`,
  USER_ACCOUNT_ENABLE: (userId, enabled) =>
    `${IAM_API_SRC}/users/${userId}/enable-account?enabled=${enabled}`,
  USER_ACCOUNT_CREATE: (id) => `${IAM_API_SRC}/users/${id}`,
  USER_CREATE: `${IAM_API_SRC}/users`,
  USER_PROFILE: `${IAM_API_SRC}/users/@userId/profile`,
  PROFILE: `${IAM_API_SRC}/me/profile`,
  PROFILE_CHANGE_PASSWORD: `${IAM_API_SRC}/me/password`,
  USER_CHANGE_PASSWORD: `${IAM_API_SRC}/users/me/profile/change-password`,
  USER_RESET_PASSWORD: (id) => `${IAM_API_SRC}/user/${id}/reset-password`,
  LIST_USER_MENU_API: `${IAM_API_SRC}/users/me/active-functions`,
  LIST_USER_AUTHORITY_API: `${IAM_API_SRC}/users/me/authority`,
  LIST_ALL_MENU_API: `${IAM_API_SRC}/functions/search`,
  LIST_ORG_UNIT: `${IAM_API_SRC}/org-units`,
  LIST_DEPARTMENT: `${IAM_API_SRC}/groups/search`,
  ADD_DEPARTMENT: `${IAM_API_SRC}/groups`,
  DETAIL_DEPARTMENT: (id) => `${IAM_API_SRC}/groups/${id}`,
  UPDATE_DEPARTMENT: (id) => `${IAM_API_SRC}/groups/${id}/update`,
  STATUS_DEPARTMENT: ({ id, status }) =>
    `${IAM_API_SRC}/groups/${id}?enabled=${!status}`,
  MOVE_DEPARTMENT: `${IAM_API_SRC}/groups/move`,
  LIST_USER: `${IAM_API_SRC}/users/search`,
  POLICY_LIST: `${IAM_API_SRC}/policies/search`,
  CURRENT_USER_DETAIL: `${IAM_API_SRC}/me/profile`,
  POLICY_DELETE: (id) => `${IAM_API_SRC}/policies/${id}`,
  POLICY_DELETE_USER: `${IAM_API_SRC}/pi-policies`,
  LIST_POLICY: `${IAM_API_SRC}/policies`,
  PI_POLICY: `${IAM_API_SRC}/pi-policies/users`,
  POST_USER_POLICY: `${IAM_API_SRC}/pi-policies`,
  LIST_RESOURCE: `${IAM_API_SRC}/resources`,
  DASHBOARD: `${IAM_API_SRC}/users/company-statistic-all`,
  COMPANY_DASHBOARD: `${IAM_API_SRC}/users/user-statistic-by-time`,
  COMPANY_STATISTIC: `${IAM_API_SRC}/users/download-user`,
  STATISTIC: `${IAM_API_SRC}/users/user-statistic`,
  EXPORT_STATISTIC: `${IAM_API_SRC}/users/export-company-statistic`,
  IMPORT_HISTORY: `${IAM_API_SRC}/users/imported-histories`,
  UPLOAD_COVID: `${IAM_API_SRC}/users/upload-user-covid`,
  UPLOAD_COVID_TEMPLATE: `${IAM_API_SRC}/users/download/covid-template`,
  VEHICLES: `${IAM_API_SRC}/vehicles/search`,
  VEHICLE_TYPES: `${IAM_API_SRC}/vehicle-types`,
  CARD_DETAIL: `${IAM_API_SRC}/cards/detail`,
  CARD_ASSIGN: `${IAM_API_SRC}/cards/assign`,
};

export const USER_CARD_API = {
  LIST: `${IAM_API_SRC}/cards/gets`,
  SEARCH: `${IAM_API_SRC}/cards/search`,
  DETAILS: (id) => `${IAM_API_SRC}/cards/${id}/detail`,
  UPDATE: (id) => `${IAM_API_SRC}/cards/${id}`,
  DELETE: `${IAM_API_SRC}/cards/delete`,
  ADD: `${IAM_API_SRC}/cards`,
  BLOCK: (id) => `${IAM_API_SRC}/cards/${id}/block`,
  IMPORT: (assign = false) =>
    `${IAM_API_SRC}/cards/import-${assign ? 'assigned-cards' : 'cards'}`,
  TEMPLATE: (assign = false) =>
    `${IAM_API_SRC}/cards/import-${
      assign ? 'assigned-cards' : 'cards'
    }/template`,
  IMPORT_BLOCK: `${IAM_API_SRC}/cards/block-by-file`,
  TEMPLATE_BLOCK: `${IAM_API_SRC}/cards/block-by-file/template`,
};

export const API_CMS = {
  USER_MENU_API: `${CMS_API_SRC}/dev/users/me/menus`,
  MENU_API_DEV: `${CMS_API_SRC}/dev/menus`,
  MENU_API_DETAIL: `${CMS_API_SRC}/dev/policies`,
  MENU_API_POLICY: `${CMS_API_SRC}/menus`,
  MENU_API_DEV_POLICY: `${CMS_API_SRC}/menus/policies`,
};
export const API_FILE = {
  DOWNLOAD_API: `${STORAGE_SRC}/libraries/download`,
  DOWNLOAD_FILE: (id) => `${STORAGE_SRC}/libraries/download/${id}`,
  DOWNLOAD_PUBLIC_API: `${STORAGE_SRC}/libraries/public/download`,
  DOWNLOAD_PUBLIC_FILE: (id) =>
    `${STORAGE_SRC}/libraries/public/download/${id}`,
  UPLOAD_API: `${STORAGE_SRC}/libraries/upload`,
  UPLOAD_MULTI_API: `${STORAGE_SRC}/libraries/upload/multi`,
  DOWNLOAD_FILE_API: (path) => `${STORAGE_SRC}/libraries/download/file/${path}`,
  GENERATE_URL: `${STORAGE_SRC}/generate-presigned-url`,
};

export const NOTIFICATION_EVENT_API = {
  LIST: `${NOTIFICATION_EVENT_API_SRC}/events`,
  DETAIL: (id) => `${NOTIFICATION_EVENT_API_SRC}/events/${id}`,
  CANCEL: (id) => `${NOTIFICATION_EVENT_API_SRC}/events/${id}/cancel`,
  LIST_EVENT_STATUS: `${NOTIFICATION_EVENT_API_SRC}/events/event-status`,
  LIST_EVENT_TYPES: `${NOTIFICATION_EVENT_API_SRC}/events/event-types`,
};

export const NOTIFICATION_API = {
  LIST: `${NOTIFICATION_EVENT_API_SRC}/me/notifications`,
  DETAILS: (id) => `${NOTIFICATION_EVENT_API_SRC}/notifications/${id}`,
  COUNT: `${NOTIFICATION_EVENT_API_SRC}/notifications/count-unread`,
  READ: `${NOTIFICATION_EVENT_API_SRC}/notifications/mark-read`,
  READ_ALL: `${NOTIFICATION_EVENT_API_SRC}/notifications/mark-read-all`,
  UNREAD: `${NOTIFICATION_EVENT_API_SRC}/notifications/mark-unread`,
};

export const FIRE_ALARM_API = {
  LIST: `${FIRE_ALARM}/issues`,
  INFOR: (id) => `${FIRE_ALARM}/issues/${id}`,
  PUSH_NOTI: `${FIRE_ALARM}/issues/push-notification`,
  LIST_WRONG: `${FIRE_ALARM}/issues/list-wrong`,
  LIST_FAS: `${FIRE_ALARM}/locations`,
  LIST_FAS_DEVICES: `${FIRE_ALARM}/locations/devices`,
  CREATE_FAS: `${FIRE_ALARM}/locations`,
  FAS_INFOR: (id) => `${FIRE_ALARM}/locations/${id}`,
  FAS_IMPORT: `${FIRE_ALARM}/locations/import`,
  FAS_DOWNLOAD_TEMPLATE: `${FIRE_ALARM}/locations/download-template`,
};

export const LIST_NOTIFICATION_API = `${process.env.API_HOST}/notification/api/${process.env.API_VERSION}/notifications`;

export const API_DEVICE_GROUP = `${process.env.API_HOST}/dmp/${process.env.API_VERSION}/device-groups`;
export const API_AC_ADAPTER = `${process.env.API_HOST}/dmp/${process.env.API_VERSION}`;

// Intercom API
export const SERVER_API = {
  GET_LIST: `${INTERCOM_SRC}/servers`,
  EDIT: (id) => `${INTERCOM_SRC}/servers/${id}`,
  DELETE: (id) => `${INTERCOM_SRC}/servers/${id}`,
  INFO: (id) => `${INTERCOM_SRC}/servers/${id}`,
};

// Camera API
export const CAMERA_API = {
  GET_LIST: `${DEVICE_API_SRC}/devices`,
  EDIT: (id) => `${DEVICE_API_SRC}/devices/${id}`,
  INFO: (id) => `${DEVICE_API_SRC}/devices/${id}`,
};

// EVENT API
export const EVENT_API = {
  TYPE: `${DEVICE_API_SRC}/events/types`,
  GET_LIST: `${DEVICE_API_SRC}/events/search`,
  INFO: (id) => `${DEVICE_API_SRC}/events/${id}`,
  EDIT: (ids) => `${DEVICE_API_SRC}/events/${ids}`,
};
// LIBRARY API
export const LIBRARY_API = {
  GET_LIST: `${DEVICE_API_SRC}/libraries/search`,
  DELETE: (ids) => `${DEVICE_API_SRC}/libraries/${ids}`,
  DOWNLOAD: (id) => `${DEVICE_API_SRC}/libraries/download/${id}`,
};

export const API_ACCESS_CONTROL = {
  LIST_EVENT_TYPE: `${ACCESS_CONTROL_API_SRC}/event-categories`,
  LIST_EVENT: `${ACCESS_CONTROL_API_SRC}/events`,
  LIST_EVENT_SUMMARY_STATISTICS: `${ACCESS_CONTROL_API_SRC}/events/summary-statistics`,
  LIST_EVENT_GUEST_STATISTICS: (timeType) =>
    `${ACCESS_CONTROL_API_SRC}/events/guest-statistics?timeType=${timeType}`,
  LIST_EVENT_EMPLOYEE_STATISTICS: (timeType) =>
    `${ACCESS_CONTROL_API_SRC}/events/employee-statistics?timeType=${timeType}`,
  LIST_ISSUE: `${ACCESS_CONTROL_API_SRC}/warning-history`,
  LIST_DEVICE: `${ACCESS_CONTROL_API_SRC}/devices`,
  LIST_DEVICE_STATUS: `${ACCESS_CONTROL_API_SRC}/device-status`,
  LIST_DOOR: `${ACCESS_CONTROL_API_SRC}/door-status`,
  LIST_ELEVATOR: `${ACCESS_CONTROL_API_SRC}/elevator-status`,
  EVENT_STATISTIC: `${ACCESS_CONTROL_API_SRC}/events/event-statistics`,
  AUTHORITY_STATISTIC: `${ACCESS_CONTROL_API_SRC}/events/authentication-mode-statistics`,
  ACCESSCONTROL_GROUP_STATISTIC: `${ACCESS_CONTROL_API_SRC}/events/access-group-statistics`,
  CARD_INFO: (id) => `${ACCESS_CONTROL_API_SRC}/cards/${id}`,
  EXPORT_EVENT: `${ACCESS_CONTROL_API_SRC}/events/export-history`,
};
// AC ZONE API
export const AC_ZONE_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/zones`,
  ADD: `${ACCESS_CONTROL_API_SRC}/zones`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/zones/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/zones/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/zones/${id}`,
  STATUS: ({ id, status }) =>
    `${ACCESS_CONTROL_API_SRC}/zones/${id}/${status ? 'inactive' : 'active'}`,
};
// AC GROUP DOOR API
export const AC_GROUP_DOOR_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/door-groups`,
  ADD: `${ACCESS_CONTROL_API_SRC}/door-groups`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/door-groups/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/door-groups/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/door-groups/${id}`,
  GET_CHILD: `${ACCESS_CONTROL_API_SRC}/door-groups/children-lv1`,
};
// AC DOOR API
export const AC_DOOR_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/doors`,
  ADD: `${ACCESS_CONTROL_API_SRC}/doors`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/doors/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/doors/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/doors/${id}`,
};
// AC HOLIDAY API
export const AC_HOLIDAY_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/holidays`,
  ADD: `${ACCESS_CONTROL_API_SRC}/holidays`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/holidays/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/holidays/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/holidays/${id}`,
};
// AC GROUP ELEVATOR API
export const AC_GROUP_ELEVATOR_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/elevator-groups`,
  ADD: `${ACCESS_CONTROL_API_SRC}/elevator-groups`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/elevator-groups/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/elevator-groups/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/elevator-groups/${id}`,
  GET_CHILD: `${ACCESS_CONTROL_API_SRC}/elevator-groups/children-lv1`,
};
// AC ELEVATOR API
export const AC_ELEVATOR_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/elevators`,
  ADD: `${ACCESS_CONTROL_API_SRC}/elevators`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/elevators/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/elevators/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/elevators/${id}`,
};
// AC FLOOR API
export const AC_FLOOR_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/floor-accesses`,
  ADD: `${ACCESS_CONTROL_API_SRC}/floor-accesses`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/floor-accesses/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/floor-accesses/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/floor-accesses/${id}`,
  STATUS: ({ id, status }) =>
    `${ACCESS_CONTROL_API_SRC}/floor-accesses/${id}/${
      status ? 'inactive' : 'active'
    }`,
};
// ACCESS GROUP API
export const ACCESSGROUP_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/access-groups`,
  ADD: `${ACCESS_CONTROL_API_SRC}/access-groups`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/access-groups/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/access-groups/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/access-groups/${id}`,
  STATUS: ({ id, status }) =>
    `${ACCESS_CONTROL_API_SRC}/access-groups/${id}/${
      status ? 'inactive' : 'active'
    }`,
};
// ACCESS LEVEL API
export const ACCESSLEVEL_API = {
  GET_LIST: `${ACCESS_CONTROL_API_SRC}/door-accesses`,
  ADD: `${ACCESS_CONTROL_API_SRC}/door-accesses`,
  INFO: (id) => `${ACCESS_CONTROL_API_SRC}/door-accesses/${id}`,
  EDIT: (id) => `${ACCESS_CONTROL_API_SRC}/door-accesses/${id}`,
  DELETE: (id) => `${ACCESS_CONTROL_API_SRC}/door-accesses/${id}`,
  STATUS: ({ id, status }) =>
    `${ACCESS_CONTROL_API_SRC}/door-accesses/${id}/${
      status ? 'inactive' : 'active'
    }`,
};

export const API_CAMERA_AI = {
  SEARCH_HISTORY_3_10: `${CAMERA_AI_API_SRC}/user-detected/history`,
  SEARCH_AUTOCOMPLETE_3_10: `${CAMERA_AI_API_SRC}/user-detected`,
  SEARCH_USER_DETECTED_EVENT_3_10: `${CAMERA_AI_API_SRC}/events/user-detected/by-user-info`,
  SEARCH_USER_DETECTED_BY_IMAGE_3_10: `${CAMERA_AI_API_SRC}/user-detected/image`,
  SEARCH_EVENT_DETECTED_BY_IMAGE_3_10: `${CAMERA_AI_API_SRC}/events/user-detected/search`,
  LIST_BLACKLIST_USER_3_6: `${CAMERA_AI_API_SRC}/blacklist-users`,
  DELETE_LIST_USER_3_6: `${CAMERA_AI_API_SRC}/blacklist-users`,
  UPDATE_USER_3_6: (id) => `${CAMERA_AI_API_SRC}/blacklist-users/${id}`,
  ADD_USER_BLACKLIST_3_7: `${CAMERA_AI_API_SRC}/blacklist-users`,
  MOVEMENT_DETECTED_HISTORY_3_6: `${CAMERA_AI_API_SRC}/movement-detected/blacklist-users`,
  DOWNLOAD_BLACKLIST_3_2: `${CAMERA_AI_API_SRC}/blacklist-users/export-file`,
  LIST_BLOCK_API_3_2: `${CAMERA_AI_API_SRC}/events/blocks`,
  LIST_FLOOR_API_3_2: `${CAMERA_AI_API_SRC}/events/floors`,
  LIST_DEVICE_API_3_2: `${CAMERA_AI_API_SRC}/devices/blacklist-user-detected`,
  DETAIL_EVENT_API_3_2: (id) =>
    `${CAMERA_AI_API_SRC}/events/${id}/blacklist-user`,
  EDIT_DESCRIPTION_3_2: (id) => `${CAMERA_AI_API_SRC}/events/${id}/description`,
  MOVEMENT_HISTORY_3_2: `${CAMERA_AI_API_SRC}/movement-detected`,
  GET_MAP_FLOOR_3_2: `${CAMERA_AI_API_SRC}/movement-detected/map/floor`,
  DATA_INTRUSION_EVENT_3_5: `${CAMERA_AI_API_SRC}/events`,
  MOVEMENT_HISTORY_3_5: `${CAMERA_AI_API_SRC}/devices/detected-user`,
  LIST_ITEMS_TYPE_3_12: `${CAMERA_AI_API_SRC}/item/type`,
  LIST_ITEMS_COLOR_3_12: `${CAMERA_AI_API_SRC}/item/color`,
  LIST_ITEMS_CAMERAAI_3_12: `${CAMERA_AI_API_SRC}/events/item-detected`,
  VALIDATE_BLACKLIST_UPLOAD_IMAGE: `${CAMERA_AI_API_SRC}/blacklist-users/images/validate`,
  VALIDATE_USER_DETECTED_UPLOAD_IMAGE: `${CAMERA_AI_API_SRC}/user-detected/images/validate`,
  ENGINE_TYPE: `${CAMERA_AI_API_SRC}/engine-type`,
  ENGINE_TYPE_DETAILS: (id) => `${CAMERA_AI_API_SRC}/engine-type/${id}`,
  ENGINE_TYPE_DELETE_VERSION: `${CAMERA_AI_API_SRC}/engine-type/remove-version-file`,
  ENGINE_TYPE_UPLOAD_VERSION: `${CAMERA_AI_API_SRC}/engine-type/version-file/upload`,
  ENGINE_TYPE_ADD_VERSION: (id) =>
    `${CAMERA_AI_API_SRC}/engine-type/add-version-file/${id}`,
  ENGINE_TYPE_EDIT_VERSION: (id) =>
    `${CAMERA_AI_API_SRC}/engine-type/update-version-file?version-file-id=${id}`,
};
export const API_EVENTS = {
  LIST_EVENTS_FILTER: `${CAMERA_AI_API_SRC}/events/filter`,
  LIST_EVENTS: `${CAMERA_AI_API_SRC}/events`,
  UPDATE_STATUS_EVENT: (id) =>
    `${CAMERA_AI_API_SRC}/events/${id}/update-event-status`,
  LIST_EVENT_TYPE: `${CAMERA_AI_API_SRC}/events/list-event-types`,
  LIST_EVENT_DEVICE: `${CAMERA_AI_API_SRC}/devices`,
  DETAILS_EVENT: (id) => `${CAMERA_AI_API_SRC}/events/${id}`,
  UPDATE: (id) => `${CAMERA_AI_API_SRC}/events/${id}/update`,
};
export const API_FORBIDDEN_AREA = {
  SEARCH: `${CAMERA_AI_API_SRC}/forbidden-area/search`,
  DETAIL: `${CAMERA_AI_API_SRC}/forbidden-area/detail-info`,
  LIST_BLOCKS: `${CAMERA_AI_API_SRC}/forbidden-area/list-blocks`,
  LIST_FLOORS: `${CAMERA_AI_API_SRC}/forbidden-area/list-floors`,
  UPDATE: ({ id }) => `${CAMERA_AI_API_SRC}/forbidden-area/${id}`,
  DELELE_WHITE_USER: ({ whiteUserId, forbiddenAreaId }) =>
    `${CAMERA_AI_API_SRC}/forbidden-area/white-user/${whiteUserId}/delete/${forbiddenAreaId}`,
  ADD_WHITE_USER: ({ forbiddenAreaId }) =>
    `${CAMERA_AI_API_SRC}/whitelist-users/add/${forbiddenAreaId}`,
  LIST_WHITE_USER: `${CAMERA_AI_API_SRC}/whitelist-users`,
  SEARCH_HISTORY: `${CAMERA_AI_API_SRC}/whitelist-users/search/history`,
};

export const API_DETAIL_USER_IDENTITY = {
  LIST: (userId) => `${ACCESS_CONTROL_API_SRC}/users/${userId}/detail`,
  DELETE: (userId) => `${ACCESS_CONTROL_API_SRC}/users/${userId}`,
  AUTHENTICATION_MODE: (userId) =>
    `${ACCESS_CONTROL_API_SRC}/users/${userId}/authentication-mode`,
  VERIFY_CARD: (cardNumber) =>
    `${ACCESS_CONTROL_API_SRC}/user-cards/card-number/${cardNumber}`,
  ADD_CARD: `${ACCESS_CONTROL_API_SRC}/user-cards`,
  DELETE_CARD: (cardId) => `${ACCESS_CONTROL_API_SRC}/user-cards/${cardId}`,
  DELETE_FACE: (userId) => `${ACCESS_CONTROL_API_SRC}/user-faces/${userId}`,
  DELETE_FINGER: (userId) =>
    `${ACCESS_CONTROL_API_SRC}/user-fingerprints/user/${userId}`,
  USER_ACCESS_AUTHENTICATION: (userId) =>
    `${ACCESS_CONTROL_API_SRC}/user-access/${userId}/authentications`,
};
export const API_PARKING = {
  ADD_MAP_INDOOR: `${PARKING_API_SRC}/map-indoor`,
  GET_IN_OUT: (areaId, buildingId, range) =>
    `${PARKING_API_SRC}/parking/getInOut?areaId=${areaId}&buildingId=${buildingId}&range=${range}`,
  LIST_PAYMENT: `${PARKING_API_SRC}/payment`,
  EXPORT_CSV: `${PARKING_API_SRC}/payment/extract-data`,
  PARKING_LOT: `${PARKING_API_SRC}/pklots`,
  PARKING_LANES: `${PARKING_API_SRC}/lanes`,
  PARKING_ENTRY_POINTS: `${PARKING_API_SRC}/entrypts`,
};

export const API_PARKING_LOT = {
  GET_DATA_STATE: (module) => `${PARKING_API_SRC}/${module}/options/list-state`,
  GET_DATA_TYPE: (module) => `${PARKING_API_SRC}/${module}/options/list-type`,
  GET_DATA_APPlY: (module) =>
    `${PARKING_API_SRC}/${module}/options/list-apply-condition`,
  GET_DATA_CONFIG: (module) =>
    `${PARKING_API_SRC}/${module}/options/config-template`,
  GET_DATA_MONEY: (module) => `${PARKING_API_SRC}/${module}/options/list-money`,
  GET_TYPE_ALERT: (module) => `${PARKING_API_SRC}/${module}/alert-type`,
  PARKING_LOT: `${PARKING_API_SRC}/pklots`,
  PARKING_LANES: `${PARKING_API_SRC}/lanes`,
  PARKING_ENTRY_POINTS: `${PARKING_API_SRC}/entrypts`,
  PARKING_DEVICES: `${PARKING_API_SRC}/devices`,
  PARKING_APGS: `${PARKING_API_SRC}/apgs`,
  PARKING_SERVICES: `${PARKING_API_SRC}/services`,
  PARKING_RULES: `${PARKING_API_SRC}/authrules`,
  PARKING_BLACKLISTS: `${PARKING_API_SRC}/blacklists`,
  PARKING_LPNS: `${PARKING_API_SRC}/lpns`,
  PARKING_HISTORIES: `${PARKING_API_SRC}/histories`,
  HISTORY_PAYMENT: `${PARKING_API_SRC}/histories/payment-log`,
  HISTORY_DISCOUNT: `${PARKING_API_SRC}/histories/discount`,
  PARKING_ALERTS: `${PARKING_API_SRC}/alerts`,
  PARKING_BLACKLISTS_IMPORT: `${PARKING_API_SRC}/blacklists/import-list`,
  PARKING_CARDS: `${PARKING_API_SRC}/cards`,
  PARKING_CARDS_IMPORT: `${PARKING_API_SRC}/cards/import-list`,
  PARKING_SUBSCRIBERS: `${PARKING_API_SRC}/subscribers`,
  PARKING_VEH: `${PARKING_API_SRC}/vehcompany`,
  PARKING_VERSIONS: `${PARKING_API_SRC}/versions`,
  PARKING_PROMOTE: `${PARKING_API_SRC}/promotes`,
  PARKING_VOUCHER: `${PARKING_API_SRC}/vouchers`,
  PARKING_SUBSCRIBERS_IMPORT: `${PARKING_API_SRC}/subscribers/import-list`,
  PARKING_USER: `${PARKING_API_SRC}/users`,
  PARKING_UPLOAD_ENTRY_POINT: `${PARKING_API_SRC}/upload-file/entrypts`,
  PARKING_UPLOAD_PKLOTS: `${PARKING_API_SRC}/upload-file/pklots`,
  PARKING_UPLOAD_LANES: `${PARKING_API_SRC}/upload-file/lanes`,
  PARKING_UPLOAD_DEVICES: `${PARKING_API_SRC}/upload-file/devices`,
  PARKING_UPLOAD_CARDS: `${PARKING_API_SRC}/upload-file/cards`,
  PARKING_UPLOAD_USERS: `${PARKING_API_SRC}/upload-file/cards`,
  PARKING_UPLOAD_SUBSCRIBER: `${PARKING_API_SRC}/upload-file/subscriber`,
  PARKING_UPLOAD_BLACKLISTS: `${PARKING_API_SRC}/upload-file/blacklists`,
  PARKING_DOWNLOAD_LOT: `${PARKING_API_SRC}/download-file/pklots`,
  PARKING_DOWNLOAD_ENTRY_POINTS: `${PARKING_API_SRC}/download-file/entrypts`,
  PARKING_DOWNLOAD_LANES: `${PARKING_API_SRC}/download-file/lanes`,
  PARKING_DOWNLOAD_DEVICES: `${PARKING_API_SRC}/download-file/devices`,
  PARKING_DOWNLOAD_CARDS: `${PARKING_API_SRC}/download-file/cards`,
  PARKING_DOWNLOAD_USERS: `${PARKING_API_SRC}/download-file/users`,
  PARKING_DOWNLOAD_SUBSCRIBERS: `${PARKING_API_SRC}/download-file/subscriber`,
  PARKING_DOWNLOAD_BLACKLISTS: `${PARKING_API_SRC}/download-file/blacklists`,
};
export const CAM_AI_SERVER = {
  LIST_SERVER: `${CAMERA_AI_API_SRC}/servermanagers`,
  DETAILS_SERVER: (id) => `${CAMERA_AI_API_SRC}/servermanagers/${id}`,
  LIST_BUCKET: (id) => `${CAMERA_AI_API_SRC}/servermanagers/${id}/buckets`,
  DETAILS_BUCKET: (id) => `${CAMERA_AI_API_SRC}/servermanagers/${id}/bucket`,
};
export const CAM_AI_SIREN = {
  LIST: `${CAMERA_AI_API_SRC}/sirens`,
  DETAILS: (id) => `${CAMERA_AI_API_SRC}/sirens/${id}`,
  TURN_OFF: (id) => `${CAMERA_AI_API_SRC}/sirens/${id}/turn-off`,
};
export const CAM_AI_DEVICE = {
  LIST: `${CAMERA_AI_API_SRC}/devices`,
  DETAILS: (id) => `${CAMERA_AI_API_SRC}/devices/${id}`,
  SNAPSHOT: (id) => `${CAMERA_AI_API_SRC}/devices/${id}/snapshot`,
};
export const CAM_AI_EDGE = {
  LIST_EDGE: `${CAMERA_AI_API_SRC}/fpgaManagers`,
  DETAILS_EDGE: (id) => `${CAMERA_AI_API_SRC}/fpgaManagers/${id}`,
  LIST_PROCESS_EDGE: (edgeId) =>
    `${CAMERA_AI_API_SRC}/fpga-process/fpga-manager/${edgeId}`,
  ADD_PROCESS: `${CAMERA_AI_API_SRC}/fpga-process`,
  DETAILS_PROCESS: (id) => `${CAMERA_AI_API_SRC}/fpga-process/${id}`,
  STATUS_PROCESS: (id) =>
    `${CAMERA_AI_API_SRC}/fpga-process/update-status/${id}`,
  ADD_MULTI_FILE: `${CAMERA_AI_API_SRC}/fpgaManagers/add-multi-fpga`,
  DELETE_FILE: (edgeId, fileId) =>
    `${CAMERA_AI_API_SRC}/fpga-version-file/delete/${edgeId}/${fileId}`,
  LIST_FILE_BY_ENGINE_CODE: (id) =>
    `${CAMERA_AI_API_SRC}/fpga-version-file/fpga-manager/${id}`,
};
export const CAM_AI_CONFIG_HUMAN_MODULE = {
  GET_FILE_VERSIONS: (id) => `${CAMERA_AI_API_SRC}/fpgaManagers/${id}`,
  GET_MINIOS: (id) => `${CAMERA_AI_API_SRC}/server-infor/${id}/buckets`,
  GET_CAMERAS: `${CAMERA_AI_API_SRC}/devices`,
  GET_FPGA_PROCESS: (id) => `${CAMERA_AI_API_SRC}/fpga-process/${id}`,
  ADD_FPGA_PROCESS: `${CAMERA_AI_API_SRC}/fpga-process`,
  UPDATE_FPGA_PROCESS: (id) => `${CAMERA_AI_API_SRC}/fpga-process/${id}`,
};

export const GUEST_DASHBOARD = {
  GUEST_STATISTIC_CHART: `${ACCESS_CONTROL_API_SRC}/users/guest-statistic-by-time`,
  GUEST_STATISTIC_ALL: `${ACCESS_CONTROL_API_SRC}/users/guest-statistic`,
  LIST_STATISTIC: `${ACCESS_CONTROL_API_SRC}/users/orgUnit-guest-statistics`,
  LIST_GUEST_OF_COMPANY: (id) =>
    `${GUEST_REGISTRATION}/guests/guest-statistics-by-companyId/${id}`,
  EXPORT_GUEST_BY_ORGUNIT: (id) =>
    `${GUEST_REGISTRATION}/guests/export-guest-by-orgUnit/${id}`,
  EXPORT_ORGUNIT_STATISTIC: `${ACCESS_CONTROL_API_SRC}/users/export-orgUnit-guests`,
};
export const REGISTRATION_API = {
  LIST_REGISTRATION: `${GUEST_REGISTRATION}/registrations`,
  DETAILS_REGISTRATION: (id) => `${GUEST_REGISTRATION}/registrations/${id}`,
  VEHICLE_ROUTE: (id, vehicleId) =>
    `${GUEST_REGISTRATION}/registrations/${id}/vehicle/${vehicleId}`,
  APPROVE: (id) => `${GUEST_REGISTRATION}/registrations/${id}/approve`,
  CANCEL: (id) => `${GUEST_REGISTRATION}/registrations/${id}/cancel`,
  REJECT: (id, reason) =>
    `${GUEST_REGISTRATION}/registrations/${id}/reject?rejectReason=${reason}`,
  COMPLETE: (id) => `${GUEST_REGISTRATION}/registrations/${id}/complete`,
};
export const GUEST_API = {
  LIST: `${IAM_API_SRC}/guests`,
  CREATE: `${IAM_API_SRC}/guests/create`,
  READ: (id) => `${IAM_API_SRC}/guests/${id}`,
  UPDATE: (id) => `${IAM_API_SRC}/guests/${id}/update`,
  UPLOAD_FILE: `${IAM_API_SRC}/guests/create-by-file`,
};

export const FEEDBACK_API = {
  LIST: `${ARTICLES_SRC}/feedback/search`,
  INFO: (id) => `${ARTICLES_SRC}/feedback/${id}/detail`,
  EDIT: `${ARTICLES_SRC}/feedback`,
  HISTORY: `${ARTICLES_SRC}/feedback/comment/search`,
  REPLY: (id) => `${ARTICLES_SRC}/feedback/${id}/response`,
  DELETE: (id) => `${ARTICLES_SRC}/feedback/${id}`,
};

export const INTERCOM_API = {
  SERVERS: `${INTERCOM_SRC}/intercom/servers`,
  CREATE: `${INTERCOM_SRC}/intercom/create`,
  READ: (id) => `${INTERCOM_SRC}/intercom/servers/${id}`,
  UPDATE: (id) => `${INTERCOM_SRC}/intercom/servers/${id}/update`,
  SEARCH: `${INTERCOM_SRC}/intercom/servers/search`,
}