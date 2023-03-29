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
    dataField: 'description',
    caption: 'SERVER',
  },
  {
    dataField: 'group_name',
    caption: 'GROUP',
  },
  {
    dataField: 'server_type',
    caption: 'TYPE',
    
  },
  {
    dataField: 'server_url',
    caption: 'URL',
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