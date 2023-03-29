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
    dataField: 'device_name',
    caption: 'Device name',
  },
  {
    dataField: 'version',
    caption: 'Version',
  },
  {
    dataField: 'status',
    caption: 'status',
    
  },
  {
    dataField: 'ip_address',
    caption: 'IP address',
  },
  {
    dataField: 'mac_address',
    caption: 'Mac address',
  },
  {
    dataField: 'unit_code',
    caption: 'Unit code',
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