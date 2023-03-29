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
    dataField: 'display_name',
    caption: 'Name',
  },
  {
    caption: 'Date',
    cellRender: ({data}) => (
        <div>
          {data.call_history_name.split` `[1]}
        </div>
    ),
  },
  {
    dataField: 'record_type',
    caption: 'Type',
    
  },
  {
    dataField: 'status',
    caption: 'Status',
  },
  {
    dataField: 'site_info.unit_code',
    caption: 'Site',
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