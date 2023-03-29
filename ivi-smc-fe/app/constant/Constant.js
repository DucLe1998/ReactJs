export const EVENT_TYPE = {
  EVENT: 'EVENT',
  BLOCK: 'BLOCK',
};
export const MODE = {
  NEW: 'NEW',
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  CLONE: 'CLONE',
  REMOVE: 'REMOVE',
};

export const ERROR_MAP = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    label: 'Không tìm thấy người dùng',
  },
  ROLE_NOT_FOUND: { code: 'ROLE_NOT_FOUND', label: 'Không tìm thấy vai trò' },
  AREA_NOT_FOUND: { code: 'AREA_NOT_FOUND', label: 'Area not found' },
  PERMISSION_NOT_FOUND: {
    code: 'PERMISSION_NOT_FOUND',
    label: 'Permission not found',
  },
  CLIENT_NOT_FOUND: { code: 'CLIENT_NOT_FOUND', label: 'Client not found' },
  USER_ROLE_RELATION_NOT_FOUND: {
    code: 'USER_ROLE_RELATION_NOT_FOUND',
    label: 'User role relation not found',
  },
  PARENT_FUNCTION_NOT_FOUND: {
    code: 'PARENT_FUNCTION_NOT_FOUND',
    label: 'Could not find parent function id',
  },
  NOT_FOUND_DEPARTMENT: {
    code: 'NOT_FOUND_DEPARTMENT',
    label: 'Không tìm thấy phòng ban',
  },
  NOT_FOUND_PARENT_DEPARTMENT_ID: {
    code: 'NOT_FOUND_PARENT_DEPARTMENT_ID',
    label: 'Không tìm thấy phòng ban cha',
  },
  ACCESS_DENIED: {
    code: 'ACCESS_DENIED',
    label: "You don't have permission to access this",
  },
  NOT_ACTIVATED_LOGIN_ACCESS_DENIED: {
    code: 'NOT_ACTIVATED_LOGIN_ACCESS_DENIED',
    label: 'You must activate account in order to login',
  },

  // INVALID_INPUT: { code: 'INVALID_INPUT', label: 'Invalid input' },
  NOT_ACTIVATED_USER: {
    code: 'NOT_ACTIVATED_USER',
    label: 'User has not been activated',
  },
  WRONG_PASSWORD: {
    code: 'WRONG_PASSWORD',
    label: 'User login with wrong password',
  },
  WRONG_OLD_PASSWORD: {
    code: 'WRONG_OLD_PASSWORD',
    label: 'Wrong old password',
  },
  CAN_NOT_UPDATE_PARENT_ID: {
    code: 'CAN_NOT_UPDATE_PARENT_ID',
    label: 'Cannot update from parentId to subId',
  },
  CAN_NOT_DELETE_DEPARTMENT: {
    code: 'CAN_NOT_DELETE_DEPARTMENT',
    label:
      'Please delete all the sub-departments that have listed under department first',
  },
  DEPARTMENT_CODE_ALREADY_EXISTED: {
    code: 'DEPARTMENT_CODE_ALREADY_EXISTED',
    label: 'Đơn vị đã tồn tại',
  },
  USER_ALREADY_EXIST: {
    code: 'USER_ALREADY_EXIST',
    label: 'Tài khoản đã tồn tại',
  },
  USER_CODE_EXISTED: {
    code: 'USER_CODE_EXISTED',
    label: 'Mã nhân viên đã tồn tại',
  },
  USER_NAME_EXISTED: {
    code: 'USER_NAME_EXISTED',
    label: 'Tài khoản đã tồn tại',
  },
  EMAIL_EXISTED: {
    code: 'EMAIL_EXISTED',
    label: 'Email đã tồn tại',
  },
  PERMISSION_ALREADY_EXIST: {
    code: 'PERMISSION_ALREADY_EXIST',
    label: 'Permission already exists',
  },
  ROLE_ALREADY_EXIST: {
    code: 'ROLE_ALREADY_EXIST',
    label: 'Vai trò đã tồn tại',
  },
  USER_ALREADY_ASSIGNED: {
    code: 'USER_ALREADY_ASSIGNED',
    label: 'User was already assigned to function',
  },
  FUNCTION_CODE_OR_NAME_EXISTED: {
    code: 'FUNCTION_CODE_OR_NAME_EXISTED',
    label: 'Function code or function name existed',
  },
  ROLE_CODE_OR_NAME_EXISTED: {
    code: 'ROLE_CODE_OR_NAME_EXISTED',
    label: 'Tên hoặc mã vai trò đã tồn tại',
  },
  ROLE_ALREADY_ASSIGNED_TO_PERMISSION: {
    code: 'ROLE_ALREADY_ASSIGNED_TO_PERMISSION',
    label: 'Không thể xóa vai trò đã được gán quyền',
  },
  ROLE_ALREADY_ASSIGNED_TO_USER: {
    code: 'ROLE_ALREADY_ASSIGNED_TO_USER',
    label: 'Xóa không thành công. Vẫn còn người dùng được gán với vai trò',
  },
  ROLE_NAME_EXISTED: {
    code: 'ROLE_NAME_EXISTED',
    label: 'Tên vai trò đã tồn tại',
  },
  ROLE_CODE_EXISTED: {
    code: 'ROLE_CODE_EXISTED',
    label: 'Mã vai trò đã tồn tại',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    label: 'Internal server error',
  },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', label: 'Token is not valid' },
  INCORRECT_OLD_PASSWORD: {
    code: 'INCORRECT_OLD_PASSWORD',
    label: 'Mật khẩu hiện tại không chính xác',
  },
  CONFLICT_NEW_PASSWORD: {
    code: 'CONFLICT_NEW_PASSWORD',
    label: 'Xác nhận mật khẩu mới không chính xác',
  },
  NEW_OLD_PASSWORD_NOT_SAME: {
    code: 'NEW_OLD_PASSWORD_NOT_SAME',
    label: 'Mật khẩu mới không được giống với mật khẩu cũ',
  },
  INVALID_OR_EXPIRED_TOKEN: {
    code: 'INVALID_OR_EXPIRED_TOKEN',
    label: 'Token is invalid or expired',
  },
  EXISTED_ZONE_CODE_ERROR: {
    code: 'EXISTED_ZONE_CODE_ERROR',
    label: 'Mã phân khu đã tồn tại',
  },
  EXISTED_ZONE_NAME_ERROR: {
    code: 'EXISTED_ZONE_NAME_ERROR',
    label: 'Tên phân khu đã tồn tại',
  },
  EXISTED_ZONE_CHILD_ERROR: {
    code: 'EXISTED_ZONE_CHILD_ERROR',
    label: 'Không thể xóa phân khu đang chứa phân khu con',
  },
  NOT_FOUND_PARENT_ZONE_ID: {
    code: 'NOT_FOUND_PARENT_ZONE_ID',
    label: 'Không tìm thấy phân khu cha ',
  },

  NOT_FOUND_ZONE_ID_IN_AREA: {
    code: 'NOT_FOUND_ZONE_ID_IN_AREA',
    label: 'Không tìm thấy phân khu trong khu vục này',
  },
  BLOCK_IN_ZONE_EXISTED: {
    code: 'BLOCK_IN_ZONE_EXISTED',
    label: 'Tồn tại tòa trong phân khu',
  },
  PARENT_IS_CHILDREN_ZONE: {
    code: 'PARENT_IS_CHILDREN_ZONE ',
    label:
      'Không thể chọn phân khu trực thuộc phân khu hiện tại làm phân khu chính',
  },
  FUNCTION_EXISTED_IN_ZONE: {
    code: 'FUNCTION_EXISTED_IN_ZONE',
    label: 'Tồn tại khu vực tiện ích trong phân khu',
  },
  ZONE_NOT_EXISTED: {
    code: 'ZONE_NOT_EXISTED ',
    label: 'Phân khu không tồn tại',
  },
  CAN_NOT_DELETE_DEPARTMENT_BEFORE_DELETE_SUB: {
    code: 'CAN_NOT_DELETE_DEPARTMENT_BEFORE_DELETE_SUB',
    label: 'Tồn tại phòng ban được gán vào phòng ban này, không thể xóa',
  },
  CAN_NOT_DELETE_DEPARTMENT_BEFORE_DELETE_USER_DEPARTMENT: {
    code: 'CAN_NOT_DELETE_DEPARTMENT_BEFORE_DELETE_USER_DEPARTMENT',
    label: 'Tồn tại người dùng được gán vào phòng ban này, không thể xóa',
  },
  POSITION_DUPLICATE: {
    code: 'POSITION_DUPLICATE',
    label: 'Vị trí bị trùng',
  },
  NAME_GROUP_DUPLICATE: {
    code: 'NAME_GROUP_DUPLICATE',
    label: 'Tên nhóm không được trùng nhau',
  },
  NAME_AUTOMATION_DUPLICATE: {
    code: 'NAME_AUTOMATION_DUPLICATE',
    label: 'Tên quy trình không được trùng nhau',
  },
  AUTOMATION_EXISTED: {
    code: 'AUTOMATION_EXISTED',
    label: 'Bạn chỉ có thể xoá nhóm rỗng',
  },
  AUTOMATION_NAME: {
    code: 'AUTOMATION_NAME',
    label: 'Tên quy trình là bắt buộc nhập',
  },
  GROUP_NAME_REQUIRED: {
    code: 'GROUP_NAME_REQUIRED',
    label: 'Tên nhóm là bắt buộc nhập',
  },
  GROUP_DUPLICATE: {
    code: 'GROUP_DUPLICATE',
    label: 'Nhóm đã được cấu hình với năm lựa chọn',
  },
  ASSET_TYPE_NOT_FOUND: {
    code: 'ASSET_TYPE_NOT_FOUND',
    label: 'Không tìm thấy loại tài sản',
  },
  ASSET_GROUP_NOT_FOUND: {
    code: 'ASSET_GROUP_NOT_FOUND',
    label: 'Không tìm thấy nhóm tài sản',
  },
  CONTRACTOR_NOT_FOUND: {
    code: 'CONTRACTOR_NOT_FOUND',
    label: 'Không tìm thấy nhà thầu',
  },
  ZONE_NOT_FOUND: {
    code: 'ZONE_NOT_FOUND',
    label: 'Không tìm thấy phân khu',
  },
  BLOCK_NOT_FOUND: {
    code: 'BLOCK_NOT_FOUND',
    label: 'Không tìm thấy tòa nhà',
  },
  FLOOR_NOT_FOUND: {
    code: 'FLOOR_NOT_FOUND',
    label: 'Không tìm thấy tầng',
  },
  UNIT_NOT_FOUND: {
    code: 'UNIT_NOT_FOUND',
    label: 'Không tìm thấy căn hộ',
  },
  FUNCTION_LOCATION_NOT_FOUND: {
    code: 'FUNCTION_LOCATION_NOT_FOUND',
    label: 'Không tìm thấy khu tiện ích',
  },
  DUPLICATED_SERIAL_ASSET: {
    code: 'DUPLICATED_SERIAL_ASSET',
    label: 'Serial bị trùng',
  },
  DUPLICATED_LOCATION_ASSET: {
    code: 'DUPLICATED_LOCATION_ASSET',
    label: 'Vị trí bị trùng',
  },
};

export const TABS = { TAB_FUNCTION: 0, TAB_USER: 1 };
export const TABS_USER = { TAB_INFO: 0, TAB_ROLE: 1 };

export const TYPE_CHECK_BOX = { ALL: 'ALL', ELEMENT: 'ELEMENT' };

export const ACTION_OBJECT = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  MARK_AS_FALSE: 'mark_as_false',
  NOTIFY: 'notify',
  GRANT_ROLE: 'grant_role',
};

// eslint-disable-next-line no-useless-escape
export const FULL_NAME_REGEX = /^[A-Za-z'\-\.\s0-9]+([A-Za-z'\-\.0-9]+)*$/;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,40})/;
export const USER_CODE_REGEX = /^[A-Za-z0-9]{3,20}$/;
export const USER_NAME_REGEX = /^[A-Za-z0-9]{3,20}$/;

export const ZONE_CODE_REGEX = /^[A-Za-z0-9]{3,20}$/;

export const PHONE_NUMBER_REGEX = /^[0-9]{10}$/;

export const getFixedYear = () => {
  const years = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 2020; i <= 2100; i++) {
    years.push({ value: i, name: `${i}` });
  }
  return years;
};

export const TYPE_SCHEDULE = [
  { value: 'S', name: 'Dịch vụ' },
  { value: 'M', name: 'Bảo trì' },
  { value: 'I', name: 'Kiểm định' },
];

export const getFrequencyConfig = () => {
  const frequencies = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 53; i++) {
    frequencies.push({ value: i, name: `${i}` });
  }
  return frequencies;
};
export const TABLE_NUMBER_REGEX = /^[0-9]{11}$/;
