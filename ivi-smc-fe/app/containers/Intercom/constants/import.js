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
    dataField: 'title',
    caption: 'Title',
  },
  {
    caption: 'import_type',
    caption: 'IMPORT TYPE',
  },
  {
    dataField: 'number_total',
    caption: 'TOTAL',
    
  },
  {
    dataField: 'number_success',
    caption: 'SUCCESS',
  },
  {
    dataField: 'number_fail',
    caption: 'FAIL',
  },
  {
    dataField: 'created_date',
    caption: 'DATE',
  },
  // link_error
  // link_upload
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