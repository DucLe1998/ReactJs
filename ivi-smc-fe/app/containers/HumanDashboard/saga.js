// import { get } from 'lodash';
// import faker from 'faker';
import { debounce, call, put } from 'redux-saga/effects';
import { getApi } from 'utils/requestUtils';
import { API_IAM } from '../apiUrl';
import { loadListError, loadListSuccess, setLoading } from './actions';
import { LOAD_LIST } from './constants';

/**
 *
 * Lây danh sách canh bao
 */
export function* loadList(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(getApi, API_IAM.DASHBOARD, action.query);
    const { data } = response;
    // const data = {
    //   rows: new Array(get(action, 'query.limit', 25)).fill().map((d, i) => ({
    //     id: i + 1,
    //     name: faker.address.city(),
    //     code: faker.datatype.uuid(),
    //     totalCount: faker.datatype.number(),
    //     active: faker.datatype.number(),
    //     inActive: faker.datatype.number(),
    //     face: faker.datatype.number(),
    //     card: faker.datatype.number(),
    //     finger: faker.datatype.number(),
    //   })),
    //   totalPage: 5,
    //   totalCount: 100,
    // };
    // yield delay(300);
    yield put(loadListSuccess(data));
  } catch (err) {
    yield put(loadListError(err));
  }
}
// Individual exports for testing
export default function* humanDashboardSaga() {
  // See example in containers/HomePage/saga.js
  yield debounce(500, LOAD_LIST, loadList);
}
