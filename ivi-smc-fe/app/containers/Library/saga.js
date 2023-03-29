import { put, debounce, takeLatest, call } from 'redux-saga/effects';
// import { get } from 'lodash';
// import faker from 'faker';
import FileSaver from 'file-saver';
import { LOAD_LIST_FILE, DELETE_FILE, DOWNLOAD_FILE } from './constants';
import {
  setLoading,
  loadListFileError,
  loadListFileSuccess,
  deleteFileError,
  deleteFileSuccess,
  downloadFileError,
  downloadFileSuccess,
} from './actions';
import { getApi, callApiExportFile, delApi } from '../../utils/requestUtils';
import { LIBRARY_API } from '../apiUrl';
/**
 *
 * Lây danh sách file
 */
export function* loadListFile(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(getApi, LIBRARY_API.GET_LIST, action.query);
    const { data } = response;
    // const data = {
    //   rows: new Array(get(action, 'query.limit', 25)).fill().map((d, i) => {
    //     const fullName = faker.system.commonFileName();
    //     const file = fullName.split('.');
    //     const image = faker.image.image();
    //     return {
    //       id: i + 1,
    //       fullName,
    //       name: file[0],
    //       ext: file[1],
    //       type: faker.random.boolean(),
    //       thumbnail: image,
    //       source: image,
    //       updateAt: faker.date.past(),
    //       size: faker.random.number(),
    //     };
    //   }),
    //   totalPage: 5,
    //   totalCount: 100,
    // };
    // yield delay(300);
    yield put(loadListFileSuccess(data));
  } catch (err) {
    yield put(loadListFileError(err));
  }
}
/**
 *
 * delete files
 */
export function* deleteFile(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(delApi, LIBRARY_API.DELETE(action.data));
    const { data } = response;
    // yield delay(300);
    yield put(deleteFileSuccess(data));
  } catch (err) {
    yield put(deleteFileError(err));
  }
}
/**
 *
 * download files
 */
export function* downloadFile(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(
      callApiExportFile,
      LIBRARY_API.DOWNLOAD(action.data.id),
      'GET',
    );
    FileSaver.saveAs(response, action.data.name);
    // yield delay(300);
    yield put(downloadFileSuccess(response));
  } catch (err) {
    yield put(downloadFileError(err));
  }
}
export default function* librarySaga() {
  yield debounce(500, LOAD_LIST_FILE, loadListFile);
  yield takeLatest(DELETE_FILE, deleteFile);
  yield takeLatest(DOWNLOAD_FILE, downloadFile);
}
