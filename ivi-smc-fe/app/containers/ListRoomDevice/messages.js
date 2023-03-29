import { defineMessages } from 'react-intl';

export const scope = 'app.ROOM_DEVICE';

export default defineMessages({
  headerTitle: {
    id: `${scope}.header.title`,
    defaultMessage: 'List Device',
  },
  columnRoomName: {
    id: `${scope}.column.name`,
    defaultMessage: 'Name',
  },
  columnType: {
    id: `${scope}.column.type`,
    defaultMessage: 'Nhóm thiết bị',
  },
  columnName: {
    id: `${scope}.column.room_name`,
    defaultMessage: 'Phòng họp',
  },
  columnStatusType: {
    id: `${scope}.column.code`,
    defaultMessage: 'Code',
  },
  searchMessage: {
    id: `${scope}.label.search_placeholder`,
    defaultMessage: 'Search by name or code',
  },
  deleteConfirm: {
    id: `${scope}.message.delete.confirm`,
    defaultMessage: "Bạn có chắc chắn muốn xóa {name} bản ghi này?",
  },
  addNew: {
    id: `${scope}.add_new`,
    defaultMessage: "Thêm thiết bị",
  },
  filter: {
    id: `${scope}.filter`,
    defaultMessage: "Lọc thiết bị",
  },
  addNewSuccess: {
    id: `${scope}.message.add_success`,
    defaultMessage: "Thêm thiết bị thành công",
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: "Sửa thiết bị",
  },
  editSuccess: {
    id: `${scope}.message.edit_success`,
    defaultMessage: "Sửa thiết bị thành công",
  },
  codeInvalid: {
    id: `${scope}.message.code_invalid`,
    defaultMessage: "Mã loại không được chứa ký tự đặc biệt",
  },
});
