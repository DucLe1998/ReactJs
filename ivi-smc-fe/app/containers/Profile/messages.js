/*
 * Profile Messages
 *
 * This contains all the text for the Profile container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Profile';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Profile container!',
  },
  profile: {
    id: `${scope}.profile`,
    defaultMessage: 'Thông tin cá nhân',
  },
  fullName: {
    id: `${scope}.fullName`,
    defaultMessage: 'Họ và tên',
  },
  employeeCode: {
    id: `${scope}.employeeCode`,
    defaultMessage: 'Mã nhân viên',
  },
  masterCode: {
    id: `${scope}.masterCode`,
    defaultMessage: 'Master Code',
  },
  jobProfile: {
    id: `${scope}.jobProfile`,
    defaultMessage: 'Thông tin công việc',
  },
  policyInformation: {
    id: `${scope}.policyInformation`,
    defaultMessage: 'Thông tin pháp lý',
  },
  pl: {
    id: `${scope}.pl`,
    defaultMessage: 'P&L',
  },
  banchuoikhoi: {
    id: `${scope}.banchuoikhoi`,
    defaultMessage: 'Ban/Chuỗi/Khối',
  },
  phongvungmien: {
    id: `${scope}.phongvungmien`,
    defaultMessage: 'Phòng/Vùng/Miền',
  },
  memberUnit: {
    id: `${scope}.memberUnit`,
    defaultMessage: 'Đơn vị thành viên',
  },
  phongbophannhom: {
    id: `${scope}.phongbophannhom`,
    defaultMessage: 'Phòng/Bộ phận/Nhóm',
  },
  nhomchucdanh: {
    id: `${scope}.nhomchucdanh`,
    defaultMessage: 'Nhóm chức danh',
  },
  chucdanh: {
    id: `${scope}.chucdanh`,
    defaultMessage: 'Chức danh',
  },
  level: {
    id: `${scope}.level`,
    defaultMessage: 'Cấp bậc',
  },
  typeEmployee: {
    id: `${scope}.typeEmployee`,
    defaultMessage: 'Phân loại nhân viên',
  },
  landlinePhone: {
    id: `${scope}.landlinePhone`,
    defaultMessage: 'Số ĐT cố định - máy lẻ',
  },
  phone: {
    id: `${scope}.phone`,
    defaultMessage: 'Số ĐT di động',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  dateInOrg: {
    id: `${scope}.dateInOrg`,
    defaultMessage: 'Ngày vào tập đoàn',
  },
  dateInCompany: {
    id: `${scope}.dateInCompany`,
    defaultMessage: 'Ngày vào công ty',
  },
  address: {
    id: `${scope}.address`,
    defaultMessage: 'Địa chỉ làm việc thực tế',
  },
  changePassword: {
    id: `${scope}.changePassword`,
    defaultMessage: 'Đổi mật khẩu',
  },
  oldPassword: {
    id: `${scope}.oldPassword`,
    defaultMessage: 'Mật khẩu cũ',
  },
  newPassword: {
    id: `${scope}.newPassword`,
    defaultMessage: 'Mật khẩu mới',
  },
  confirmPassword: {
    id: `${scope}.confirmPassword`,
    defaultMessage: 'Xác nhận lại mật khẩu',
  },
  notice: {
    id: `${scope}.notice`,
    defaultMessage: 'Chú ý:',
  },
  textNotice: {
    id: `${scope}.textNotice`,
    defaultMessage:
      'Mật khẩu chứa các ký tự chữ in hoa, chữ in thường, chữ số và ký tự đặc biệt và có độ dài tối thiểu 8 ký tự',
  },
  sameOldPassword: {
    id: `${scope}.sameOldPassword`,
    defaultMessage: 'Mật khẩu mới không được trùng với mật khẩu cũ',
  },
});
