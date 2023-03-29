import { call, put, takeLatest, delay } from 'redux-saga/effects';
import {
  loadAutoCompleteSearchError,
  loadAutoCompleteSearchSuccess,
  loadSearchHistoryError,
  loadSearchHistorySuccess,
  loadUserDetectedEventError,
  loadUserDetectedEventSuccess,
  loadUserDetectedImageError,
  loadUserDetectedImageSuccess,
  showLoading,
} from './actions';
import {
  LOAD_AUTOCOMPLETE_SEARCH,
  LOAD_SEARCH_HISTORY,
  LOAD_USER_DETECTED_EVENT,
  LOAD_USER_DETECTED_IMAGE,
  SEARCH,
} from './constants';
// import { EVENT_DATA, IMAGE_SEARCH } from './Fake';
import { callApi, getApi, METHODS, postApi } from '../../utils/requestUtils';
import { API_CAMERA_AI } from '../apiUrl';

// const baseApi = 'technopark.dev.vsm.net/tnp/cameraai/api/v0';
export function* getListSearchHistory(action) {
  try {
    const response = yield call(
      callApi,
      `${API_CAMERA_AI.SEARCH_HISTORY_3_10}${action.filterObj}`,
      METHODS.GET,
    );
    yield put(loadSearchHistorySuccess(response.data));
  } catch (err) {
    yield put(loadSearchHistoryError(err));
  }
}
export function* getListAutocompleteSearch(action) {
  try {
    const response = yield call(
      callApi,
      `${API_CAMERA_AI.SEARCH_AUTOCOMPLETE_3_10}${action.filterObj}`,
      METHODS.GET,
    );
    // const response = PREVIEW_DATA.data.rows;
    yield put(loadAutoCompleteSearchSuccess(response.data));
  } catch (err) {
    yield put(loadAutoCompleteSearchError(err));
  }
}

export function* getListUserDetectedEvent(action) {
  const response = {
    detectedEvents: {
      totalPage: 0,
      count: 0,
      rows: [],
    },
    detectedUsers: {
      totalPage: 0,
      count: 0,
      rows: [],
    },
    pagingCase: null,
  };
  const { pagingCase, ...params } = action.filterObj;
  const { searchParam, ...userParams } = params;
  const { keyword, ...eventParams } = params;
  yield put(showLoading());
  try {
    if (pagingCase === SEARCH.DETECTED_EVENTS_BY_TEXT) {
      const detectedEvents = yield call(
        getApi,
        API_CAMERA_AI.SEARCH_USER_DETECTED_EVENT_3_10,
        eventParams,
      );
      response.detectedEvents = detectedEvents.data;
    } else if (pagingCase === SEARCH.USERS_BY_TEXT) {
      const detectedUsers = yield call(
        getApi,
        API_CAMERA_AI.SEARCH_AUTOCOMPLETE_3_10,
        userParams,
      );
      response.detectedUsers = detectedUsers.data;
    } else {
      const detectedUsers = yield call(
        getApi,
        API_CAMERA_AI.SEARCH_AUTOCOMPLETE_3_10,
        userParams,
      );
      response.detectedUsers = detectedUsers.data;
      if (detectedUsers.data?.count === 1) {
        eventParams.searchParam = `${
          detectedUsers.data.rows[0].userDetectedName
        } - ${detectedUsers.data.rows[0].code}`;
        const detectedEvents = yield call(
          getApi,
          API_CAMERA_AI.SEARCH_USER_DETECTED_EVENT_3_10,
          eventParams,
        );
        response.detectedEvents = detectedEvents.data;
      }
    }
    yield put(loadUserDetectedEventSuccess(response));
  } catch (err) {
    yield put(loadUserDetectedEventError(err));
  }
}

export function* getListUserDetectedImage(action) {
  const formData = new FormData();
  formData.append('image', action.data.file);
  yield put(showLoading());
  try {
    const responseImage = yield call(
      callApi,
      `${API_CAMERA_AI.SEARCH_USER_DETECTED_BY_IMAGE_3_10}`,
      METHODS.POST,
      formData,
    );
    const normalPerson = responseImage.data
      ? responseImage.data
          .filter(data => data.unknownUser === false) // chi hien thi user la nhan vien
          .sort((p1, p2) => (p1.equalPercent < p2.equalPercent ? 1 : -1)) // sap xep theo do tuong dong
          .slice(0, 3) // chi lay toi da 3 user
      : [];
    const codes = responseImage.data
      ? responseImage.data.map(data => data.uuid)
      : null;
    let responseDetected = {
      data: {
        totalPage: 0,
        count: 0,
        rows: [],
      },
    };
    if (codes && codes != []) {
      responseDetected = yield call(
        postApi,
        `${API_CAMERA_AI.SEARCH_EVENT_DETECTED_BY_IMAGE_3_10}?limit=${action
          ?.data?.limit || 50}&page=${action?.data?.page || 1}`,
        {
          uuids: codes,
        },
      );
    }
    const data = {
      detectedEvents: responseDetected.data,
      relatedUsers: { rows: normalPerson },
    };
    yield delay(300);
    yield put(loadUserDetectedImageSuccess(data));
  } catch (err) {
    yield put(loadUserDetectedImageError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* getData() {
  yield takeLatest(LOAD_SEARCH_HISTORY, getListSearchHistory);
  yield takeLatest(LOAD_AUTOCOMPLETE_SEARCH, getListAutocompleteSearch);
  yield takeLatest(LOAD_USER_DETECTED_EVENT, getListUserDetectedEvent);
  yield takeLatest(LOAD_USER_DETECTED_IMAGE, getListUserDetectedImage);
}
