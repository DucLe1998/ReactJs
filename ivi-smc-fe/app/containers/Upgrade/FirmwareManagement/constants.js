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
    caption: 'VERSION NAME',
    cellRender: ({data}) => (
        <div>
          Indoor: {data.os_version_name}
          <br/>
          Bell: {data.fw_bell_version}
        </div>
    ),
  },
  {
    dataField: 'changelog',
    caption: 'CHANGE LOG',
  },
  {
    dataField: 'changelog',
    caption: 'UPDATED',
    cellRender: ({data}) => (
      <div>
        {data.created_date}
        <br/>
        Size: {data.file_size /1024} MB
      </div>
    ),
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