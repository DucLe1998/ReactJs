import produce from 'immer';
import {
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  SHOW_LOADING,
  CLEAR_ERROR,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_ERROR,
} from './constants';
import { getErrorMessage } from '../Common/function';
// The initial state of the App
export const initialState = {
  listNotification: {
    count: 3,
    rows: [
      // {
      //   "content": "AnhLV6 đã từ chối công việc được giao, lý do : không thích",
      //   "createdAt": "2020-12-16T08:07:48.924Z",
      //   "id": "1",
      //   "isRead": true,
      //   "readAt": "2020-12-16T08:07:48.924Z",
      //   "title": "Công việc bị từ chối",
      //   "username": "string"
      // },
      // {
      //   "content": "AnhLV6 đã tiếp nhận công việc",
      //   "createdAt": "2020-12-16T08:07:48.924Z",
      //   "id": "2",
      //   "isRead": true,
      //   "readAt": "2020-12-16T08:07:48.924Z",
      //   "title": "Công việc được tiếp nhận",
      //   "username": "string"
      // },
      // {
      //   "content": "PhuVk đang đợi phê duyệt công việc kiểm tra ống nước",
      //   "createdAt": "2020-12-16T08:07:48.924Z",
      //   "id": "3",
      //   "isRead": true,
      //   "readAt": "2020-12-16T08:07:48.924Z",
      //   "title": "Có công việc mới cần phê duyệt",
      //   "username": "Có công việc mới cần phê duyệt"
      // }
    ],
    page: 1,
    limit: 25,
    totalPage: 1,
  },
  error: '',
  loading: true,
};

const listParkings = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_DATA_SUCCESS:
        draft.listNotification = action.data;
        draft.loading = false;
        draft.error = '';
        break;
      case MARK_AS_READ_SUCCESS:
        break;
      case LOAD_DATA_ERROR:
      case MARK_AS_READ_ERROR:
        draft.error = getErrorMessage(action.err);
        draft.loading = false;
        break;
      case CLEAR_ERROR:
        draft.error = '';
        break;
      case SHOW_LOADING:
        draft.loading = action.isLoading;
        break;
      default:
      // draft.loading = true;
    }
  });

export default listParkings;
