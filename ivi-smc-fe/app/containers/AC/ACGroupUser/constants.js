/* eslint-disable no-unsafe-optional-chaining */
/*
 *
 * ListStaff constants
 *
 */
import React from 'react';
import gui from 'utils/gui';

import {
  IconCard,
  IconFace,
  IconFinger,
} from 'components/Custom/Icon/ListIcon';
import { Link } from 'react-router-dom';
import { startOfDay, sub } from 'date-fns';
import { getUniqueArr } from 'utils/utils';

export const DEFAULT_ACTION = 'app/ListStaff/DEFAULT_ACTION';
export const IDENTIFY_TYPES = {
  FACES: { id: 0, label: 'Khuôn mặt (available soon)' },
  FINGERPRINTS: { id: 1, label: 'Vân tay (available soon)' },
  CARD: { id: 2, label: 'Thẻ' },
};

export const DATE_ACTIVE = [
  { value: null, label: 'Tất cả' },
  { value: 'AVAILABLE', label: 'Còn hiệu lực' },
  { value: 'EXPIRED', label: 'Hết hiệu lực' },
];

export const STATUS_FILTER = [
  { value: null, label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Không hoạt động' },
];

export const IDENFIFICATION_FILTER = [
  { value: null, label: 'Tất cả' },
  { value: 'true', label: 'Đã định danh' },
  { value: 'false', label: 'Chưa định danh' },
];

export const STATUS = [
  { value: 'INACTIVE', label: 'Không hoạt động' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
];

export const EFFECTTIMETYPE = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'UNLIMITED', label: 'Vĩnh viễn' },
  { value: 'LIMITED', label: 'Có thời hạn' },
];
export const USERTYPE = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'EMPLOYEE', label: 'Nhân viên' },
  { value: 'RESIDENT', label: 'Chủ nhà' },
  { value: 'GUEST', label: 'Khách' },
];

export const IDENFIFICATION = [
  { value: 'false', label: 'Chưa định danh' },
  { value: 'true', label: 'Đã định danh' },
];

export const IDENFIFICATION_DEFAULT_VAL = [
  {
    identifyId: null,
    identifyMethod: 'CARD',
    updatedAt: null,
    identifyStatus: false,
    status: 'INACTIVE',
    cardNumber: null,
  },
  {
    identifyId: null,
    identifyMethod: 'FINGERPRINTS',
    updatedAt: null,
    identifyStatus: false,
    status: 'INACTIVE',
    fingerprints: [],
  },
  {
    identifyId: null,
    identifyMethod: 'FACES',
    updatedAt: null,
    identifyStatus: false,
    status: 'INACTIVE',
    faces: [],
  },
];

export const MIN_DATE = sub(startOfDay(new Date()), {
  months: 3,
});

export const COLUMNSLISTUSER = [
  {
    dataField: 'accessCode',
    caption: 'Mã định danh',
    alignment: 'center',
    width: gui.screenWidth / 16,
  },
  {
    dataField: 'fullName',
    caption: 'Họ và tên',
    width: gui.screenWidth / 8,
    cellRender: (e) => (
      <Link
        to={
          e?.data?.userType === 'GUEST'
            ? `/guests/${e.data.id}`
            : `/user/details/${e.data.id}/info`
        }
      >
        {e.data.fullName}
      </Link>
    ),
  },
  {
    dataField: 'email',
    caption: 'Email',
    width: gui.screenWidth / 8,
  },
  {
    width: gui.screenWidth / 12,
    dataField: 'phoneNumber',
    caption: 'Số điện thoại',
  },
  {
    dataField: 'userGroups',
    caption: 'Tên nhóm người dùng',
    cellRender: (v) => <ViewGroupUser v={v} />,
  },
  {
    dataField: 'org',
    caption: 'Đơn vị',
    cellRender: (v) => {
      const ele = v?.data?.org || [];
      const abc = getUniqueArr([...(v?.value || []), ...ele], 'id');
      return (
        <div className="ct-flex-row">
          <div>
            {(v?.value && v?.value[0]?.name) || (ele && ele[0]?.name) || ''}
          </div>
          {v?.value?.length || v?.data?.org?.length ? (
            <div
              style={{
                height: 15,
                width: 30,
                backgroundColor: '#E4E4E4',
                fontSize: 12,
                fontWeight: 400,
                borderRadius: 9,
                textAlign: 'center',
                marginLeft: 8,
              }}
            >
              {abc?.length || ''}
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    dataField: 'accessGroups',
    caption: 'Nhóm quyền',
    cellRender: (v) => {
      const ele = v?.data?.accessGroups || [];
      const abc = getUniqueArr([...(v?.value || []), ...ele], 'id');
      return (
        <div className="ct-flex-row">
          <div>
            {(v?.value && v?.value[0]?.name) || (ele && ele[0]?.name) || ''}
          </div>
          {v?.value?.length || v?.data?.accessGroups?.length ? (
            <div
              style={{
                height: 15,
                width: 30,
                backgroundColor: '#E4E4E4',
                fontSize: 12,
                fontWeight: 400,
                borderRadius: 9,
                textAlign: 'center',
                marginLeft: 8,
              }}
            >
              {abc?.length || ''}
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    dataField: 'numberOfFaces',
    headerCellRender: () => <IconFace />,
    // cellRender: (v) => <div>{v?.value ? v?.value.length : 0}</div>,
  },
  // {
  //   dataField: 'fingerprintIds',
  //   headerCellRender: () => <IconFinger />,
  //   cellRender: (v) => <div>{v?.value ? v?.value.length : 0}</div>,
  // },
  {
    dataField: 'numberOfCards',
    headerCellRender: () => <IconCard />,
    // cellRender: (v) => <div>{v?.value ? v?.value.length : 0}</div>,
  },
  {
    dataField: 'status',
    caption: 'Trạng thái',
    cellRender: (v) => (
      <div>{v.value === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</div>
    ),
  },
].map((item, index) => ({
  ...item,
  key: index + 1,
  id: index + 1,
  alignment: 'center',
}));

export const COLUMNSLISTUSER_DETAIL = [
  {
    dataField: 'accessCode',
    caption: 'Mã định danh',
  },
  {
    dataField: 'userType',
    caption: 'Phân loại',
    cellRender: (e) => (
      <div>
        {e.value === 'GUEST'
          ? 'Khách'
          : e.value === 'EMPLOYEE'
          ? 'Nhân viên'
          : 'Chủ nhà'}
      </div>
    ),
  },
  {
    dataField: 'fullName',
    caption: 'Tên người dùng',
    cellRender: (e) => (
      // eslint-disable-next-line no-template-curly-in-string
      <Link to={`/user/details/${e.data.id}/info`}>{e.data.fullName}</Link>
    ),
  },
  {
    dataField: 'userGroups',
    caption: 'Nhóm người dùng',
    cellRender: (v) => <ViewGroupUser v={v} />,
  },
  {
    dataField: 'status',
    caption: 'Trạng thái',
    cellRender: (v) => (
      <div>{v.value === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</div>
    ),
  },
  {
    dataField: 'faceIds',
    headerCellRender: () => <IconFace />,
    cellRender: (v) => <div>{v?.value ? v?.value.length : 0}</div>,
  },
  {
    dataField: 'fingerprintIds',
    headerCellRender: () => <IconFinger />,
    cellRender: (v) => <div>{v?.value ? v?.value.length : 0}</div>,
  },
  {
    dataField: 'cardIds',
    headerCellRender: () => <IconCard />,
    cellRender: (v) => <div>{v?.value ? v?.value.length : 0}</div>,
  },
].map((item, index) => ({
  ...item,
  key: index + 1,
  id: index + 1,
  alignment: 'center',
}));

export const ViewGroupUser = ({ v }) => (
  <div>
    {v?.value?.map((o, index) => (
      <div
        style={{
          // border: '1px solid #DDDDDD81',
          padding: 4,
          marginTop: 4,
          borderRadius: 4,
        }}
        key={index.toString()}
      >
        {o?.name}
      </div>
    ))}
  </div>
);
