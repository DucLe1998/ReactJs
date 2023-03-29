import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import { getApi, putApi } from 'utils/requestUtils';
import { EVENT_API } from '../apiUrl';
import {
  editWarningError,
  editWarningSuccess,
  loadInfoWarningError,
  loadInfoWarningSuccess,
  loadListWarningError,
  loadListWarningSuccess,
  setLoading,
} from './actions';
// import { get } from 'lodash';
// import faker from 'faker';
import { EDIT_WARNING, INFO_WARNING, LOAD_LIST_WARNING } from './constants';
/**
 *
 * Lây danh sách canh bao
 */
export function* loadListWarning(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(getApi, EVENT_API.GET_LIST, action.query);
    const { data } = response;
    // const data = {
    //   rows: new Array(get(action, 'query.limit', 25)).fill().map((d, i) => ({
    //     warning_id: i + 1,
    //     warning_type_name: faker.commerce.productName(),
    //     device_name: faker.name.firstName(),
    //     device_type_id: DEVICE_TYPE[i % 2].id,
    //     device_type_name: DEVICE_TYPE[i % 2].name,
    //     area_name: faker.address.city(),
    //     block_name: faker.address.state(),
    //     floor_name: faker.address.streetName(),
    //     unit_name: faker.address.countryCode(),
    //     location_name: faker.address.secondaryAddress(),
    //     updateAt: faker.date.past(),
    //     status: WARNING_STATUS[Math.floor((Math.random() * 10) % 3)],
    //     note: faker.lorem.sentences(),
    //   })),
    //   totalPage: 5,
    //   totalCount: 100,
    // };
    // yield delay(300);
    yield put(loadListWarningSuccess(data));
  } catch (err) {
    yield put(loadListWarningError(err));
  }
}
/**
 *
 * info canh bao
 */
export function* infoWarning(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(getApi, EVENT_API.INFO(action.data.id));
    const { data } = response;
    yield put(loadInfoWarningSuccess(data));
  } catch (err) {
    yield put(loadInfoWarningError(err));
  }
}
/**
 *
 * edit canh bao
 */
export function* editWarning(action) {
  try {
    yield put(setLoading(true));
    const { ids, description, status } = action.data;
    const response = yield call(putApi, EVENT_API.EDIT(ids), {
      description,
      status: status.id,
    });
    const { data } = response;
    yield put(editWarningSuccess(data));
  } catch (err) {
    yield put(editWarningError(err));
  }
}
// Individual exports for testing
export default function* listWarningSaga() {
  // See example in containers/HomePage/saga.js
  yield debounce(500, LOAD_LIST_WARNING, loadListWarning);
  yield takeLatest(INFO_WARNING, infoWarning);
  yield takeLatest(EDIT_WARNING, editWarning);
}
