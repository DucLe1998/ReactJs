/*
 *
 * HumanDashboard constants
 *
 */

const scope = 'app/HumanDashboard';
export const DEFAULT_ACTION = 'app/HumanDashboard/DEFAULT_ACTION';
export const STATISTIC_ITEM = [
  {
    key: 'empImportedTotal',
    label: 'Tổng nhân viên đã nhập',
    icon: 'all_user',
  },
  {
    key: 'empTotal',
    label: 'Nhân viên trên hệ thống',
    icon: 'in_user',
    line: true,
    color: '#0D74E4',
  },
  {
    key: 'empNotExistTotal',
    label: 'Nhân viên chưa có trên hệ thống',
    icon: 'out_user',
    download: '/users/download-existed-user',
  },
  {
    key: 'empActive',
    label: 'Nhân viên active',
    icon: 'active_user',
    line: true,
    color: '#14B86E',
  },
  {
    key: 'empInActive',
    label: 'Nhân viên chưa active',
    icon: 'inactive_user',
    line: true,
    color: '#25282B',
  },
  {
    key: 'faceTotal',
    label: 'Khuôn mặt',
    icon: 'face',
  },
  {
    key: 'fingerTotal',
    label: 'Vân tay',
    icon: 'finger',
  },
  { key: 'cardTotal', label: 'Thẻ', icon: 'card' },
];
export const BACKDATE_ITEM = [
  {
    label: '7 ngày',
    key: 'DAY_7',
  },
  {
    label: '30 ngày',
    key: 'DAY_30',
  },
  {
    label: '6 tháng',
    key: 'MONTH_6',
  },
  {
    label: '12 tháng',
    key: 'MONTH_12',
  },
  {
    label: '36 tháng',
    key: 'MONTH_36',
  },
];

export const SET_LOADING = `${scope}/SET_LOADING`;
export const SET_OPEN_DRAWER = `${scope}/SET_OPEN_DRAWER`;
export const SET_PAGE = `${scope}/SET_PAGE`;

export const LOAD_LIST = `${scope}/LOAD_LIST`;
export const LOAD_LIST_SUCCESS = `${scope}/LOAD_LIST_SUCCESS`;
export const LOAD_LIST_ERROR = `${scope}/LOAD_LIST_ERROR`;
