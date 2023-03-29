import { defineMessages } from 'react-intl';

export const scope = 'app.ROOM_DEVICE_TYPE';

export default defineMessages({
  headerTitle: {
    id: `${scope}.header.title`,
    defaultMessage: 'List Device Type',
  },
  columnName: {
    id: `${scope}.column.name`,
    defaultMessage: 'Name',
  },
  columnStatusType: {
    id: `${scope}.column.code`,
    defaultMessage: 'Code',
  },
  columnCreated: {
    id: `${scope}.column.createdAt`,
    defaultMessage: 'Thời gian tạo nhóm thiết bị',
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
    defaultMessage: "Tạo nhóm loại thiết bị",
  },
  addNewSuccess: {
    id: `${scope}.message.add_success`,
    defaultMessage: "Tạo nhóm thiết bị thành công",
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: "Sửa nhóm thiết bị",
  },
  editSuccess: {
    id: `${scope}.message.edit_success`,
    defaultMessage: "Sửa nhóm thiết bị thành công",
  },
  codeInvalid: {
    id: `${scope}.message.code_invalid`,
    defaultMessage: "Mã loại không được chứa ký tự đặc biệt",
  },
});
