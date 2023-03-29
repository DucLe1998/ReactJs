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
    caption: 'Tên thiết bị',
  },
  {
    dataField: 'device_type',
    caption: 'Loại thiết bị',
  },
  {
    dataField: 'version',
    caption: 'Phiên bản',
    cellRender: (e) => (
        <div>
            <p>App version: {e.data.os_version_name}</p>
            <p>Firmware version: {e.data.os_firmware_name}</p>
            <p>Firmware bell: {e.data.os_firmware_bell_name}</p>
        </div>
    ),
  },
  {
    dataField: 'device_ip',
    caption: 'Địa chỉ IP',
  },
  {
    dataField: 'device_status',
    caption: 'Trạng thái',
  },
  {
    dataField: 'device_id',
    caption: 'ID thiết bị',
  },
  {
    dataField: 'device_mac',
    caption: 'Địa chỉ MAC',
  },
  {
    dataField: 'site_info.unit_code',
    caption: 'UNIT CODE',
  },
];
