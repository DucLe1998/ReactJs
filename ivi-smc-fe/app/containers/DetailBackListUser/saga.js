import { call, put, takeLatest } from 'redux-saga/effects';
// import { get } from 'lodash';
// import faker from 'faker';
import {
  loadBlockError,
  loadBlockSuccess,
  loadDetailEventError,
  loadDetailEventSuccess,
  loadFloorError,
  loadFloorSuccess,
  loadListDeviceError,
  loadListDeviceSuccess,
  loadMovementHisError,
  loadMovementHisSuccess,
  setLoading,
  updateDescriptionError,
  updateDescriptionSuccess,
} from './actions';
import {
  LOAD_BLOCK,
  LOAD_DETAIL_EVENT,
  LOAD_FLOOR,
  LOAD_LIST_DEVICE,
  LOAD_MOVEMENT_HISTORY,
  UPDATE_DESCRIPTION,
} from './constants';
import { getApi, putApi } from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';

export function* getListBlock(action) {
  yield put(setLoading(true));
  try {
    const response = yield call(getApi, `${API_CAMERA_AI.LIST_BLOCK_API_3_2}`);
    yield put(loadBlockSuccess(response.data));
  } catch (err) {
    yield put(loadBlockError(err));
  }
}

export function* getListFloor(action) {
  console.log(action);
  yield put(setLoading(true));
  try {
    const response = yield call(
      getApi,
      `${API_CAMERA_AI.LIST_FLOOR_API_3_2}/${action.data}/floors`,
    );
    yield put(loadFloorSuccess(response.data));
  } catch (err) {
    yield put(loadFloorError(err));
  }
}

export function* getListDevice(action) {
  yield put(setLoading(true));
  try {
    const response = yield call(
      getApi,
      `${API_CAMERA_AI.LIST_DEVICE_API_3_2}`,
      action.data,
    );
    const map = yield call(
      getApi,
      `${API_CAMERA_AI.GET_MAP_FLOOR_3_2}/${action.data.floorId}`,
    );
    response.map = map.data.imageUrl;
    yield put(loadListDeviceSuccess(response));
  } catch (err) {
    yield put(loadListDeviceError(err));
  }
}

export function* getListMovementHistory(action) {
  yield put(setLoading(true));
  try {
    // const response = {
    //   data: new Array(get(action, 'query.limit', 25)).fill().map((d, i) => ({
    //     areaId: i,
    //     areaName: faker.name.firstName(),
    //     blockId: i,
    //     blockName: faker.name.firstName(),
    //     deviceId: i,
    //     deviceName: faker.name.firstName(),
    //     floorId: i,
    //     id: i,
    //     imageUrl: faker.image.imageUrl(),
    //     objectId: i,
    //     timeOccur: faker.time.recent() - 12 * 60 * 60 * 1000,
    //     zoneId: i,
    //     zoneName: faker.name.firstName(),
    //   })),
    // };
    const response = yield call(
      getApi,
      `${API_CAMERA_AI.MOVEMENT_HISTORY_3_2}`,
      action.data,
    );
    yield put(loadMovementHisSuccess(response.data));
  } catch (err) {
    yield put(loadMovementHisError(err));
  }
}

export function* getDetailEvent(action) {
  yield put(setLoading(true));
  try {
    const response = yield call(
      getApi,
      API_CAMERA_AI.DETAIL_EVENT_API_3_2(action.data),
    );
    yield put(loadDetailEventSuccess(response.data));
  } catch (err) {
    yield put(loadDetailEventError(err));
  }
}

export function* updateDescription(action) {
  yield put(setLoading(true));
  try {
    const response = yield call(
      putApi,
      API_CAMERA_AI.EDIT_DESCRIPTION_3_2(action.data.id),
      {
        description: action.data.description,
      },
    );
    yield put(updateDescriptionSuccess(response.data));
  } catch (err) {
    yield put(updateDescriptionError(err));
  }
}

// Individual exports for testing
export default function* detailBackListUserSaga() {
  yield takeLatest(LOAD_BLOCK, getListBlock);
  yield takeLatest(LOAD_FLOOR, getListFloor);
  yield takeLatest(LOAD_LIST_DEVICE, getListDevice);
  yield takeLatest(LOAD_MOVEMENT_HISTORY, getListMovementHistory);
  yield takeLatest(LOAD_DETAIL_EVENT, getDetailEvent);
  yield takeLatest(UPDATE_DESCRIPTION, updateDescription);
}
