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
    caption: 'Version',
    cellRender: ({data}) => (
        <div>
          Firmware Indoor: {data.os_firmware_name}
          <br/>
          Firmware Bell: {data.os_firmware_bell_name}
        </div>
    ),
  },
  {
    dataField: 'device_status',
    caption: 'Status',
    
  },
  {
    dataField: 'device_ip',
    caption: 'Ip address',
  },
  {
    dataField: 'device_mac',
    caption: 'Mac address',
  },
  {
    dataField: 'site_info.unit_code',
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