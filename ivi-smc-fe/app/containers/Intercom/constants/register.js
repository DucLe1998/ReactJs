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
    caption: 'Register device',
  },
  {
    caption: 'Avatar',
    cellRender: ({data}) => (
        <div>
          {/* {data.guest_avatar} */}
        </div>
    ),
  },
  {
    dataField: 'status',
    caption: 'Status',
    
  },
  {
    dataField: 'created_date',
    caption: 'Created date',
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