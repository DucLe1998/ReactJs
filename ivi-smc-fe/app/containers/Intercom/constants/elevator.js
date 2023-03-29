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
    dataField: 'TRACKID',
    caption: 'TRACKID',
  },
  {
    caption: 'MQTT TOPIC',
    cellRender: ({data}) => (
        <div>
          {/* {data.guest_avatar} */}
        </div>
    ),
  },
  {
    dataField: 'event',
    caption: 'EVENT',
    
  },
  {
    dataField: 'MEMBER',
    caption: 'MEMBER',
  },
  {
    dataField: 'TIME',
    caption: 'TIME',
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