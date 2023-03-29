import React from 'react';
import { Link } from 'react-router-dom';

export const COLUMNS_LIST = [
  {
    caption: 'STT',
    cellRender: (e) => <div>{e.rowIndex + 1}</div>,
    width: 100,
    alignment: 'center',
  },
  {
    dataField: 'device_type',
    caption: 'Device',
  },
  {
    dataField: 'server_type',
    caption: 'Storage type',
  },
  {
    dataField: 'os_version_name',
    caption: 'Version name',
    
  },
  {
    dataField: 'changelog',
    caption: 'Change log',
  },
  {
    dataField: 'file_size',
    caption: 'Information',
  },
];

export const initValueFilter = {
  keyword: '',
  limit: 25,
  page: 1,
};

export const titlePopup = {
  filter: 'Bộ lọc',
  add: 'Thêm mới',
  delete: 'Xóa',
  edit: 'Sửa',
}