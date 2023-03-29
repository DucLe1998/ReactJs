import { call, debounce, put } from 'redux-saga/effects';
import { getApi } from 'utils/requestUtils';
// import { getAreaObjectFromTree } from 'utils/functions';
import { CAMERA_API } from '../apiUrl';
import {
  loadListCameraError,
  loadListCameraSuccess,
  setLoading,
} from './actions';
// import { get } from 'lodash';
// import faker from 'faker';
import { LOAD_LIST_CAMERA } from './constants';
/**
 *
 * Lây danh sách camera
 */
export function* loadListCamera(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(getApi, CAMERA_API.GET_LIST, action.query);
    const { data } = response;
    // const data = {
    //   rows: new Array(get(action, 'query.limit', 25)).fill().map((d, i) => ({
    //     camera_id: i + 1,
    //     camera_name: faker.commerce.product(),
    //     nvr_name: faker.commerce.department(),
    //     area_name: faker.address.city(),
    //     block_name: faker.address.state(),
    //     floor_name: faker.address.streetName(),
    //     unit_name: faker.address.countryCode(),
    //     location_name: faker.address.secondaryAddress(),
    //     status: faker.random.boolean(),
    //   })),
    //   totalPage: 5,
    //   totalCount: 100,
    // };
    // yield delay(300);
    yield put(loadListCameraSuccess(data));
  } catch (err) {
    yield put(loadListCameraError(err));
  }
}
// /**
//  *
//  * info
//  */
// export function* infoCamera(action) {
//   try {
//     yield put(setLoading(true));
//     const response = yield call(getApi, CAMERA_API.INFO(action.data.id));
//     const { data } = response;
//     yield put(loadInfoCameraSuccess(data));
//   } catch (err) {
//     yield put(loadInfoCameraError(err));
//   }
// }
// /**
//  *let
//  * edit camera
//  */
// export function* editCamera(action) {
//   try {
//     yield put(setLoading(true));
//     const { id, area, ...payload } = action.data;
//     const obj = getAreaObjectFromTree(area);
//     const response = yield call(putApi, CAMERA_API.EDIT(id), {
//       ...payload,
//       ...obj,
//     });
//     const { data } = response;
//     yield put(editCameraSuccess(data));
//   } catch (err) {
//     yield put(editCameraError(err));
//   }
// }
// Individual exports for testing
export default function* listCameraSaga() {
  // See example in containers/HomePage/saga.js
  yield debounce(500, LOAD_LIST_CAMERA, loadListCamera);
}
