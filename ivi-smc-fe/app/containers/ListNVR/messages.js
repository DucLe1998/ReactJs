import { defineMessages } from 'react-intl';

export const scope = 'app.NVR';

export default defineMessages({
  headerTitle: {
    id: `${scope}.header.title`,
    defaultMessage: 'Danh sách thiết bị NVR',
  },
  addTitle: {
    id: `${scope}.add.title`,
    defaultMessage: 'Thêm thiết bị NVR',
  },
  cameraList: {
    id: `${scope}.camera_list`,
    defaultMessage: 'List Camera',
  },
  addButton: {
    id: `${scope}.header.add_button`,
    defaultMessage: 'Thêm mới',
  },
  deleteButton: {
    id: `${scope}.header.delete_button`,
    defaultMessage: 'Xóa',
  },
  statusPlaceholder: {
    id: `${scope}.header.filter_status_placeholder`,
    defaultMessage: 'Trạng thái',
  },
  columnOrder: {
    id: `${scope}.column.order`,
    defaultMessage: 'STT',
  },
  columnName: {
    id: `${scope}.column.name`,
    defaultMessage: 'Device name',
  },
  columnCode: {
    id: `${scope}.column.code`,
    defaultMessage: 'Device code',
  },
  columnIP: {
    id: `${scope}.column.IP`,
    defaultMessage: 'IP Thiết bị',
  },
  columnPort: {
    id: `${scope}.column.port`,
    defaultMessage: 'Cổng Thiết bị',
  },
  columnSerial: {
    id: `${scope}.column.serial`,
    defaultMessage: 'Số Serial',
  },
  columnArea: {
    id: `${scope}.column.area`,
    defaultMessage: 'Khu vực',
  },
  columnVersion: {
    id: `${scope}.column.version`,
    defaultMessage: 'Phiên bản',
  },
  columnAvailable: {
    id: `${scope}.column.available`,
    defaultMessage: 'Camera',
  },
  columnStatus: {
    id: `${scope}.column.status`,
    defaultMessage: 'Trạng thái',
  },
  searchPlaceholder: {
    id: `${scope}.header.search_placeholder`,
    defaultMessage: 'Search',
  },
  changePassHeaderTitle: {
    id: `${scope}.change_password.header.title`,
    defaultMessage: 'Change password',
  },
  oldPassword: {
    id: `${scope}.old_pasword`,
    defaultMessage: 'Old password',
  },
  newPassword: {
    id: `${scope}.new_pasword`,
    defaultMessage: 'New password',
  },
  confirmPassword: {
    id: `${scope}.confirm_pasword`,
    defaultMessage: 'Confirm',
  },
  addMode: {
    id: `${scope}.add_mode`,
    defaultMessage: 'Mode',
  },
  addMoreItem1: {
    id: `${scope}.add_mode.item1`,
    defaultMessage: 'IP/ Domain',
  },
  addMoreItem2: {
    id: `${scope}.add_mode.item2`,
    defaultMessage: 'Import file',
  },
  downloadTemplateFile: {
    id: `${scope}.button.dowload_template`,
    defaultMessage: 'Download',
  },
  mgIPInvalid: {
    id: `${scope}.message.ip_invalid`,
    defaultMessage: 'IP is invalid',
  },
  mgPassInvalid: {
    id: `${scope}.message.password_invalid`,
    defaultMessage:
      'Please enter a password has length from 8 - 16 characters. Password must include at least two types in number, upper case,normal case and special character.',
  },
  mgRequiredInput: {
    id: `${scope}.message.require_input`,
    defaultMessage: 'this field is required',
  },
  mgDeleteConfirm: {
    id: `${scope}.message.delete.confirm`,
    defaultMessage: 'confirm',
  },
  deleteNVR: {
    id: `${scope}.delete.title`,
    defaultMessage: 'Delete',
  },
  detailTitle: {
    id: `${scope}.detail.title`,
    defaultMessage: 'Detail',
  },
  editTitle: {
    id: `${scope}.edit.title`,
    defaultMessage: 'Edit NVR',
  },
  ipPlaceholder: {
    id: `${scope}.ip.placeholder`,
    defaultMessage: 'IP',
  },
  portPlaceholder: {
    id: `${scope}.port.placeholder`,
    defaultMessage: 'port',
  },
  namePlaceholder: {
    id: `${scope}.name.placeholder`,
    defaultMessage: 'name',
  },
  usernamePlaceholder: {
    id: `${scope}.username.placeholder`,
    defaultMessage: 'username',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'password',
  },
  passwordPlaceholder: {
    id: `${scope}.password.placeholder`,
    defaultMessage: 'password',
  },
  areaPlaceholder: {
    id: `${scope}.area.placeholde`,
    defaultMessage: 'area',
  },
  buttonEditTolltip: {
    id: `${scope}.button.edit.tooltip`,
    defaultMessage: 'Edit',
  },
  buttonChangePasswordTolltip: {
    id: `${scope}.button.change_pasword.tooltip`,
    defaultMessage: 'change password',
  },
  buttonChangePassword: {
    id: `${scope}.button.change_pasword`,
    defaultMessage: 'change password',
  },
  buttonDeleteTolltip: {
    id: `${scope}.button.delete.tooltip`,
    defaultMessage: 'delete',
  },
  labelDevice: {
    id: `${scope}.device`,
    defaultMessage: 'Devices',
  },
  labelSelectFile: {
    id: `${scope}.select_file`,
    defaultMessage: 'Select file',
  },
});
