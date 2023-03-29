/*
 * NotFoundPage Messages
 *
 * This contains all the text for the NotFoundPage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ListItemCameraAi';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Tìm kiếm đồ vật',
  },
  color: {
    id: `${scope}.color`,
    defaultMessage: 'Chọn màu sắc',
  },
  type: {
    id: `${scope}.type`,
    defaultMessage: 'Chọn loại đồ vật',
  },
  all: {
    id: `${scope}.all`,
    defaultMessage: 'Tất cả',
  },
  allColor: {
    id: `${scope}.allColor`,
    defaultMessage: 'Tất cả màu sắc',
  },
  result: {
    id: `${scope}.result`,
    defaultMessage: 'Kết quả tìm kiếm',
  },
  noData: {
    id: `${scope}.noData`,
    defaultMessage: 'Không có dữ liệu',
  },
  playBack: {
    id: `${scope}.playBack`,
    defaultMessage: 'Xem lại',
  },
  invalidValue: {
    id: `${scope}.invalidValue`,
    defaultMessage: 'Giá trị không hợp lệ',
  },
  searchResult: {
    id: `${scope}.searchResult`,
    defaultMessage: 'Kết quả tìm kiếm',
  },
});
