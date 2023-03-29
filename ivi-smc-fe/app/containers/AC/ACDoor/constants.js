import React from 'react';
import { Link } from 'react-router-dom';

export const STATUS_FILTER_DOOR = [
  { value: null, label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'FREE', label: 'Đang xả' },
  { value: 'DISCONNECTED', label: 'Mất kết nối' },
  { value: 'UNASSIGN', label: 'Chưa gắn thiết bị' },
  { value: 'LOCKED', label: 'Đang khóa' },
];

export const COLUMNS_LIST_DOOR = [
  {
    dataField: 'name',
    caption: 'Tên cửa',
    key: 1,
    id: 1,
    cellRender: (e) => (
      <Link to={`/ac-door/update/${e.data.id}`}>{e.value}</Link>
    ),
  },
  {
    dataField: 'deviceModel.name',
    caption: 'Tên thiết bị',
    key: 3,
    id: 3,
    cellRender: (e) => (
      <Link to={`/access-control/devices/${e.data?.deviceModel?.id}`}>
        {e.value}
      </Link>
    ),
  },
  {
    dataField: 'description',
    caption: 'Miêu tả',
    key: 4,
    id: 4,
  },
  {
    key: 5,
    id: 5,
    dataField: 'status',
    caption: 'Trạng thái',
    cellRender: (v) => {
      const found = STATUS_FILTER_DOOR.find((a) => a.value === v.value);
      return <div>{found?.label || ''}</div>;
    },
    alignment: 'center',
  },
  {
    key: 6,
    id: 6,
    dataField: 'lastUpdatedByUser.fullName',
    caption: 'Người chỉnh sửa cuối',
    alignment: 'center',
  },
];
