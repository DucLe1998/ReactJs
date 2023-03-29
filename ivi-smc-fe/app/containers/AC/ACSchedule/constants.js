import React from 'react';
import { Link } from 'react-router-dom';

export const COLUMNS_LIST_SCHEDULE = [
  {
    caption: 'STT',
    cellRender: (e) => <div>{e.rowIndex + 1}</div>,
    width: 100,
    alignment: 'center',
  },
  {
    dataField: 'name',
    caption: 'Tên',
    cellRender: (e) => (
      <Link to={`/access-control/schedule/update/${e.data.id}`}>{e.value}</Link>
    ),
  },
  {
    dataField: 'description',
    caption: 'Mô tả',
  },
  {
    dataField: 'description1',
    caption: 'Người tạo',
  },
];

export const COLUMNS_LIST_HOLIDAY = [
  {
    caption: 'STT',
    cellRender: (e) => <div>{e.rowIndex + 1}</div>,
    width: 100,
    alignment: 'center',
  },
  {
    dataField: 'name',
    caption: 'Tên',
    cellRender: (e) => (
      <Link to={`/ac-access-permission/schedule/${e.data.id}`}>{e.value}</Link>
    ),
  },
  {
    dataField: 'description',
    caption: 'Mô tả',
  },
];
