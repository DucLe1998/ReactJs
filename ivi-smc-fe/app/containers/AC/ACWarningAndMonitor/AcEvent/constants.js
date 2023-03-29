export const STATUS_FILTER_DOOR = [
  { value: null, label: 'Tất cả' },
  { value: 'CONNECTED', label: 'Đang hoạt động' },
  { value: 'OPENING', label: 'Đang mở' },
  { value: 'DISCONNECTED', label: 'Mất kết nối' },
  { value: 'CLOSING', label: 'Đang đóng' },
  { value: 'UNASSIGN', label: 'Chưa gắn thiết bị' },
  { value: 'LOCKED', label: 'Đang khóa' },
];

export const COLUMNS_LIST_EVENT = [
  {
    caption: 'STT',
    // cellRender: item => (
    //   <div style={{ textAlign: 'left' }}>
    //     {(valueFilter.page - 1) * valueFilter.limit +
    //       (item.rowIndex + 1)}
    //   </div>
    // ),
    alignment: 'left',
    width: 40,
  },
  {
    dataField: 'time',
    caption: 'Thời gian',
    // cellRender: e => (
    //   <Link to={`/ac-device/${e.data?.device?.id}`}>{e.value}</Link>
    // ),
  },
  {
    dataField: 'event',
    caption: 'Sự kiện',
  },
  {
    dataField: 'user',
    caption: 'Đối tượng thực hiện',
  },
  {
    dataField: 'location',
    caption: 'Vị trí',
    // cellRender: v => {
    //   const found = STATUS_FILTER_DOOR.find(a => a.value === v.value);
    //   return <div>{found?.label || ''}</div>;
    // },
    alignment: 'center',
  },
  {
    dataField: 'detailLocation',
    caption: 'Chi tiết vị trí',
  },
  {
    dataField: 'device',
    caption: 'Thiết bị',
  },
  {
    dataField: 'deviceType',
    caption: 'Loại thiết bị',
  },
  {
    dataField: 'userType',
    caption: 'Loại đối tượng',
  },
  {
    dataField: 'userGroup',
    caption: 'Nhóm đối tượng',
  },
  {
    dataField: 'deviceGroup',
    caption: 'Nhóm thiết bị',
  },
].map((item, index) => ({
  alignment: 'center',
  ...item,
  key: index + 1,
  id: index + 1,
}));
