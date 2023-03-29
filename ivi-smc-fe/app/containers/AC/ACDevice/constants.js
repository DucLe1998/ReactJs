import React from 'react';
import { Link } from 'react-router-dom';
import gui from 'utils/gui';
import {API_HOST}  from 'containers/apiUrl';

export const API_DEVICE_GROUP = `${API_HOST}/smc/dmp/api/v0/device-groups`;
export const API_AC_ADAPTER = `${API_HOST}/smc/dmp/api/v0`;

export const LIST_COMMAND = {
  NOTIFY_NEW_USER: 'NOTIFY_NEW_USER',
  FORCE_CLOSE_DOOR: 'FORCE_CLOSE_DOOR',
  FORCE_OPEN_DOOR: 'FORCE_OPEN_DOOR',
  PUSH_TEMPERATURE: 'PUSH_TEMPERATURE',
  FORCE_REMOVE_FACE_INFO: 'FORCE_REMOVE_FACE_INFO',
  SYNC_ALL: 'SYNC_ALL',
  SYNC_CONFIG: 'SYNC_CONFIG',
  SYNC_USER_DATA: 'SYNC_USER_DATA',
  RESTORE_ALL_TO_DEFAULT: 'RESTORE_ALL_TO_DEFAULT',
  RESTORE_WITHOUT_NETWORK_TO_DEFAULT: 'RESTORE_WITHOUT_NETWORK_TO_DEFAULT',
  SET_TIME: 'SET_TIME',
  UPLOAD_USER_DATA: 'UPLOAD_USER_DATA',
  REMOVE_USER_DATA: 'REMOVE_USER_DATA',
};

export const COLUMNS_LIST_DEVICE = [
  {
    dataField: 'deviceName',
    caption: 'Tên',
    cellRender: (e) => (
      <Link to={`/access-control/devices/${e.data.id}`}>{e.value}</Link>
    ),
    maxWidth: gui.screenWidth / 5,
  },
  {
    dataField: 'doorName',
    caption: 'Vị trí',
  },
  {
    dataField: 'deviceType',
    caption: 'Loại thiết bị',
  },
  {
    dataField: 'networkConfiguration.ipAddress',
    caption: 'Địa chỉ IP',
  },
  {
    dataField: 'deviceStatus',
    caption: 'Trạng thái',
  },
  {
    dataField: 'firmwareVersion',
    caption: 'Phiên bản app',
    show: 'index',
  },
  {
    dataField: 'hardwareVersion',
    caption: 'PB phần cứng',
    show: 'index',
  },
  {
    caption: 'Không hiển thị',
    type: 'title',
    show: 'index',
  },
].map((item, index) => ({
  alignment: 'center',
  ...item,
  key: index + 1,
  id: index + 1,
}));

export const STATUS_FILTER_DEVICE = [
  { value: null, label: 'Tất cả' },
  { value: 'CONNECTED', label: 'Đang hoạt động' },
  { value: 'DISCONNECTED', label: 'Mất kết nối server' },
  { value: 'EC_DISCONNECTED', label: 'Mất kết nối EC' },
  // { value: 'LOCKED', label: 'Đang khóa' },
  // { value: 'FREE_DOOR', label: 'Đang xả cửa' },
];

export const VECTOR_IN_OUT = [
  { value: null, label: 'Tất cả' },
  { value: 'IN', label: 'Chiều vào' },
  { value: 'OUT', label: 'Chiều ra' },
];

export const DEVICE_TYPE_DEVICE = [
  { value: null, label: 'Tất cả' },
  { value: 'CAMERA_ACCESS_IN', label: 'CAMERA ACCESS IN' },
  { value: 'CAMERA_ACCESS_OUT', label: 'CAMERA ACCESS OUT' },
  { value: 'CAMERA_ELEVATOR', label: 'CAMERA ELEVATOR' },
];
export const DEVICE_TYPE_DEVICE_EVENT = [
  { id: 'CAMERA_ACCESS_IN', name: 'CAMERA ACCESS IN' },
  { id: 'CAMERA_ACCESS_OUT', name: 'CAMERA ACCESS OUT' },
  { id: 'CAMERA_ELEVATOR', name: 'CAMERA ELEVATOR' },
];
